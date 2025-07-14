'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DocumentEditor from '../../../components/notes/DocumentEditor';

export default function Page({ params }: { params: Promise<{ uuid: string }> }) {
  const router = useRouter();
  const { uuid } = React.use(params);
  const { user, supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState<{
    id: string;
    title: string;
    content: string;
    doc_id: string;
    user_id: string;
  } | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return; // Wait for user to be set in context

      try {
        // First, check if the user owns the document
        const { data: ownedDoc, error: ownedError } = await supabase
          .from('notes')
          .select('*')
          .eq('doc_id', uuid)
          .eq('user_id', user.id)
          .single();

        if (ownedDoc && !ownedError) {
          // User owns the document
          setDoc(ownedDoc);
          setLoading(false);
          return;
        }

        // If not owned, check if the document is shared with the user
        // First get the note by doc_id to get its primary key id
        const { data: noteData, error: noteError } = await supabase
          .from('notes')
          .select('id, *')
          .eq('doc_id', uuid)
          .single();

        if (noteData && !noteError) {
          // Now check if this note's primary key id is in shared_documents
          const { data: sharedDoc, error: sharedError } = await supabase
            .from('shared_documents')
            .select('*')
            .eq('doc_id', noteData.id) // Using the primary key id
            .eq('shared_with', user.email)
            .single();

          if (sharedDoc && !sharedError) {
            // Document is shared with the user
            setDoc(noteData);
            setLoading(false);
            return;
          }
        }

        // If neither owned nor shared, redirect
        router.replace('/notes');
      } catch (error) {
        console.error('Error checking document access:', error);
        router.replace('/notes');
      }
    };

    checkAccess();
  }, [user, supabase, uuid, router]);

  if (loading)
    return (
      <div className="w-full justify-center items-center h-screen text-center">Loading...</div>
    );

  return <DocumentEditor doc={doc} />;
}
