'use client';

import React, { useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Type,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  ImageIcon,
  TableIcon,
  Highlighter,
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
  insertImage: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, insertImage }) => {
  const [, setRefresh] = useState(0); // trigger re-render on editor update

  // 👇 Re-render when selection updates (e.g., cursor moves, format changes)
  useEffect(() => {
    if (!editor) return;

    const updateHandler = () => setRefresh((prev) => prev + 1);
    editor.on('selectionUpdate', updateHandler);
    editor.on('transaction', updateHandler);

    return () => {
      editor.off('selectionUpdate', updateHandler);
      editor.off('transaction', updateHandler);
    };
  }, [editor]);

  if (!editor) return null;

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded flex items-center justify-center transition-colors ${
      isActive ? 'bg-gray-300 text-gray-900' : 'text-gray-500 hover:bg-gray-100'
    }`;

  return (
    <div className="flex flex-wrap gap-2 border p-2 mb-2 rounded bg-white sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive('underline'))}
      >
        <UnderlineIcon size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
      >
        <Type size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
      >
        <List size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
      >
        <ListOrdered size={16} />
      </button>

      <button onClick={() => editor.chain().focus().undo().run()} className={buttonClass(false)}>
        <Undo2 size={16} />
      </button>

      <button onClick={() => editor.chain().focus().redo().run()} className={buttonClass(false)}>
        <Redo2 size={16} />
      </button>

      <input
        type="color"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        title="Font color"
        className="h-8 w-8 border-none p-0"
      />

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={buttonClass(editor.isActive('highlight'))}
      >
        <Highlighter size={16} />
      </button>

      <button onClick={insertImage} className={buttonClass(false)}>
        <ImageIcon size={16} />
      </button>

      <button
        onClick={() =>
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
        className={buttonClass(false)}
      >
        <TableIcon size={16} />
      </button>
    </div>
  );
};

export default EditorToolbar;
