'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import NoteCard from './NoteCard';

type Note = {
  id: string;
  title: string;
  content: string;
  doc_id: string;
  created_at: string;
};

export default function SharedNotesList() {
  const { user } = useAuth();
  const supabase = createClient();
  const [sharedNotes, setSharedNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSharedNotes();
    }
  }, [user]);

  function onEdit() {
    // router.push(`/notes/${note.doc_id}`);
  }

  function onDelete() {
    // console.log('Delete note with ID:', noteId);
  }

  async function fetchSharedNotes() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shared_documents')
        .select(
          `
          doc_id,
          notes:doc_id (
            id,
            title,
            content,
            doc_id,
            created_at
          )
        `,
        )
        .eq('shared_with', user.email);

      console.log('Fetched shared notes:', data);

      if (error) throw error;

      const notesOnly = data.map((entry) => entry.notes).filter(Boolean);
      setSharedNotes(notesOnly);
    } catch (error) {
      console.error('Error fetching shared notes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <p className="mt-8 text-gray-600">Loading shared notes...</p>;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Shared With You</h2>
      {sharedNotes.length === 0 ? (
        <p className="text-gray-500">No documents shared with you yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedNotes.map((note) => (
            <NoteCard note={note} key={note.id} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
