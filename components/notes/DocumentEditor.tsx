'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { debounce } from 'lodash';
import * as Y from 'yjs';
import { useAuth } from '@/context/AuthContext';
import DocumentEditorHead from './DocumentEditorHead';
import EditorToolbar from './EditorToolbar';

interface DocumentEditorProps {
  doc: {
    id: string;
    title: string;
    content: string;
    doc_id: string;
    user_id: string;
  } | null;
}

function uint8ArrayToBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToUint8Array(base64: string) {
  return new Uint8Array(
    atob(base64)
      .split('')
      .map((char) => char.charCodeAt(0)),
  );
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ doc }) => {
  const { supabase, user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Create Y.Doc with initial content
  const ydoc = useMemo(() => {
    const docInstance = new Y.Doc();

    // Initialize with content if available
    if (doc?.content && !isContentLoaded) {
      try {
        const json = JSON.parse(doc.content);

        // Get the shared type that Collaboration extension uses
        const yXmlFragment = docInstance.getXmlFragment('default');

        // Clear any existing content
        yXmlFragment.delete(0, yXmlFragment.length);

        // Method 1: Use Tiptap's prosemirror-to-yjs conversion
        // This is the most reliable way to inject content into Y.js
        const prosemirrorJSON = json;

        // We'll set this content after the editor is created
        setTimeout(() => {
          if (editorRef.current && !isContentLoaded) {
            // Use the editor's commands to set content
            editorRef.current.commands.setContent(prosemirrorJSON);
            setIsContentLoaded(true);
          }
        }, 100);
      } catch (err) {
        console.error('Failed to parse initial content:', err);
      }
    }

    return docInstance;
  }, [doc?.content, doc?.doc_id]); // Re-create when document changes

  const editorRef = useRef<Editor | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Collaboration.configure({
        document: ydoc,
        field: 'default', // Make sure this matches the fragment name
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose min-h-[600px] outline-none',
      },
    },
    immediatelyRender: false,
    // Set initial content here as fallback
    content: doc?.content
      ? (() => {
          try {
            return JSON.parse(doc.content);
          } catch {
            return '<p>Failed to load content</p>';
          }
        })()
      : '<p>Start typing...</p>',
  });

  useEffect(() => {
    if (editor) {
      editorRef.current = editor;

      // Load content after editor is ready
      if (doc?.content && !isContentLoaded) {
        try {
          const json = JSON.parse(doc.content);
          editor.commands.setContent(json);
          setIsContentLoaded(true);
        } catch (err) {
          console.error('Failed to set editor content:', err);
        }
      }
    }
  }, [editor, doc?.content, isContentLoaded]);

  // Save content to Supabase after debounce
  const saveContentToSupabase = debounce(async () => {
    const currentEditor = editorRef.current;
    console.log('Saving content to Supabase...', currentEditor, doc?.doc_id);

    if (!currentEditor || !doc?.doc_id) return;

    const json = currentEditor.getJSON();
    console.log('Saving document:', doc.doc_id, json);

    try {
      const { error } = await supabase
        .from('notes')
        .update({ content: JSON.stringify(json) })
        .eq('doc_id', doc.doc_id);

      if (error) {
        console.error('Error saving document:', error.message);
      } else {
        console.log('Document saved successfully');
      }
    } catch (err) {
      console.error('Error saving document:', err);
    }
  }, 1000); // Save after 1 second of inactivity

  useEffect(() => {
    return () => {
      console.log('Cleaning up editor...');
      saveContentToSupabase();
    };
  }, []);

  useEffect(() => {
    if (!doc?.doc_id || !ydoc) return;

    const channel = supabase.channel(`doc-${doc.doc_id}`);

    // Listen for Y.js updates
    const updateHandler = (update: Uint8Array) => {
      const encodedUpdate = uint8ArrayToBase64(update);
      console.log('Sending update:', encodedUpdate);

      // Send update to other clients
      // channel.send({
      //   type: 'broadcast',
      //   event: 'yjs-update',
      //   payload: { update: encodedUpdate },
      // });

      // Save content to database
      saveContentToSupabase();
    };

    const awarenessUpdateHandler = (update: Uint8Array, origin: any) => {
      if (origin !== 'remote') {
        const encodedUpdate = uint8ArrayToBase64(update);
        channel.send({
          type: 'broadcast',
          event: 'yjs-update',
          payload: { update: encodedUpdate },
        });
        saveContentToSupabase();
      }
    };

    ydoc.on('update', awarenessUpdateHandler);

    // Listen for updates from other clients
    channel.on('broadcast', { event: 'yjs-update' }, (event: any) => {
      try {
        const update = base64ToUint8Array(event.payload.update);
        // Y.applyUpdate(ydoc, update, 'remote');
      } catch (err) {
        console.error('Error applying update:', err);
      }
    });

    channel.subscribe((status: any) => {
      setIsConnected(status === 'SUBSCRIBED');
    });

    return () => {
      ydoc.off('update', updateHandler);
      channel.unsubscribe();
    };
  }, [doc?.doc_id, ydoc, saveContentToSupabase]);

  const insertImage = () => {
    const url = prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleShare = async () => {
    try {
      if (!shareEmail || !user?.email || !doc?.id) return;

      console.log('Sharing document with:', shareEmail, doc?.id, user?.email);

      const { error } = await supabase.from('shared_documents').insert({
        doc_id: doc.id,
        shared_with: shareEmail,
        shared_by: user?.email,
      });

      if (!error) {
        setShareEmail('');
        setShowShare(false);
        alert('Document shared successfully!');
      } else {
        alert('Error sharing document: ' + error.message);
      }
    } catch (err) {
      console.error('Error sharing document:', err);
      alert('Error sharing document');
    }
  };

  // Reset content loaded state when document changes
  useEffect(() => {
    setIsContentLoaded(false);
  }, [doc?.doc_id]);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <DocumentEditorHead setShowShare={setShowShare} doc={doc} />

        {editor && <EditorToolbar editor={editor} insertImage={insertImage} />}

        <div className="border rounded p-4 bg-white shadow min-h-[300px]">
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div className="text-gray-500">Loading editor...</div>
          )}
        </div>

        <div className="text-sm text-gray-500 mt-2">
          {isConnected ? '✅ Connected to Supabase Realtime' : '🔄 Connecting...'}
          {isContentLoaded && ' • Content loaded'}
        </div>

        {showShare && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-20">
            <div className="bg-white p-6 rounded shadow w-96">
              <h3 className="text-lg font-medium mb-4">Share Document</h3>
              <input
                type="email"
                placeholder="Enter email to share with"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="border w-full p-2 mb-4 rounded"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowShare(false)} className="px-3 py-1 border rounded">
                  Cancel
                </button>
                <button onClick={handleShare} className="px-3 py-1 bg-blue-600 text-white rounded">
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .btn {
            background: #f1f5f9;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            border: 1px solid #e2e8f0;
          }
          .btn:hover {
            background: #e2e8f0;
          }
        `}</style>
      </div>
    </div>
  );
};

export default DocumentEditor;
