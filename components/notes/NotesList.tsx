import React from 'react';
import { motion } from 'framer-motion';
import NoteCard from './NoteCard';
import { useRouter } from 'next/navigation';

type Note = {
  id: string;
  title: string;
  doc_id: string;
  content: string;
  created_at: string;
};

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NotesList({ notes, onEdit, onDelete }: NotesListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const router = useRouter();

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {notes.map((note) => (
        <NoteCard
          handleClick={() => router.push(`/notes/${note.doc_id}`)}
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </motion.div>
  );
}
