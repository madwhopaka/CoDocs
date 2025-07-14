import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DocumentEditorHeadProps {
  setShowShare: (show: boolean) => void;
  doc: {
    id: string;
    title: string;
    content: string;
    doc_id: string;
    user_id: string;
  } | null;
}

const DocumentEditorHead: React.FC<DocumentEditorHeadProps> = ({ setShowShare, doc }) => {
  const [title, setTitle] = useState(doc?.title || '');
  const [debouncedTitle, setDebouncedTitle] = useState(doc?.title || '');
  const { supabase } = useAuth();

  // Debounce save (waits 500ms after typing stops)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (debouncedTitle !== title) {
        setDebouncedTitle(title);
        updateTitle(title);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [title]);

  const updateTitle = async (newTitle: string) => {
    console.log(newTitle);
    const { error } = await supabase
      .from('notes')
      .update({ title: newTitle })
      .eq('doc_id', doc?.doc_id);

    if (error) {
      console.error('Failed to update title:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg md:text-xl font-medium text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0"
        placeholder="Untitled document"
      />
      <button onClick={() => setShowShare(true)} className="btn flex items-center gap-1">
        <Share2 size={16} /> Share
      </button>
    </div>
  );
};

export default DocumentEditorHead;
