import React, { useEffect, useState } from "react";
import "./NoteEdit.css";
import { getFullNotes, saveNewNote, createNewBlocks } from "./NoteData.jsx";

function TextBlock({ block, index, onUpdate, onMove, onDelete }) {
  return (
    <div className="note-block">
      <button onClick={() => onMove(index, -1)} disabled={index === 0}>
        ↑
      </button>

      <button onClick={() => onMove(index, 1)} disabled={false}>
        ↓
      </button>

      <button onClick={() => onDelete(index)}>×</button>
      <textarea
        className="note-text-block"
        value={block.content}
        onChange={(event) => onUpdate(index, event.target.value)}
        placeholder="Write something..."
        rows={3}
      />
    </div>
  );
}
function ImageBlock({ block, index, onMove, onDelete }) {
  const imageUrl = block.content ? getImageUrl(block.content) : null;

  return (
    <div className="note-block">
      <button onClick={() => onMove(index, -1)} disabled={index === 0}>
        ↑
      </button>

      <button onClick={() => onMove(index, 1)}>↓</button>

      <button onClick={() => onDelete(index)}>×</button>

      {imageUrl && <img className="note-image-block" src={imageUrl} alt="" />}
    </div>
  );
}

export function NoteEdit({ id, onBack }) {
  const createNote = () => ({
    id: "",
    title: "",
    description: "",
    category: "",
    date: null,
    noteblocks: [],
  });
  const [note, setNote] = useState(createNote());
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    if (!id) {
      setNote(createNote());
      console.log(note.noteblocks);
      setBlocks(data.noteblocks ?? []);
      return;
    }
    async function loadNote() {
      try {
        const data = await getFullNotes({ id: id });
        setNote(data);
        console.log(data);
        setBlocks(data.noteblocks ?? []);
      } catch (err) {
        console.error(err);
      }
    }

    loadNote();
  }, [id]);

  const addTextBlock = async () => {
    const block = {
      noteid: note.id,
      position: blocks.length,
      content: "",
      type: "text",
      link: "",
    };

    const id = await createNewBlocks({
      block: block,
    });

    setBlocks([
      ...blocks,
      {
        ...block,
        id,
      },
    ]);
  };

  const addImageBlock = async () => {
    const block = {
      noteid: note.id,
      position: blocks.length,
      content: "",
      type: "image",
      link: "",
    };

    const id = await createNewBlocks({
      note_id: note.id,
      block,
    });

    setBlocks([
      ...blocks,
      {
        ...block,
        id,
      },
    ]);
  };

  const updateBlock = (index, content) => {
    const newBlocks = [...blocks];

    newBlocks[index] = {
      ...newBlocks[index],
      content,
    };

    setBlocks(newBlocks);
  };

  const moveBlock = (index, direction) => {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= blocks.length) {
      return;
    }

    const newBlocks = [...blocks];

    [newBlocks[index], newBlocks[newIndex]] = [
      newBlocks[newIndex],
      newBlocks[index],
    ];

    setBlocks(newBlocks);
  };

  const deleteBlock = (index) => {
    setBlocks(blocks.filter((_, blockIndex) => blockIndex !== index));
  };

  const handleSave = async () => {
    const updatedNote = {
      ...note,
      title,
      blocks: blocks.map((block, index) => ({
        ...block,
        position: index,
      })),
    };
    if (note.id == null || note.id === "") {
      await saveNewNote({ notes: updatedNote });
    }
  };

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <button className="note-back-button" onClick={onBack}>
          ←
        </button>

        <input
          className="note-title-input"
          type="text"
          value={note.title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Untitled"
        />

        <button className="note-save-button" onClick={handleSave}>
          Save
        </button>
      </div>

      <div className="note-editor-content">
        {blocks.map((block, index) => {
          if (block.type === "text") {
            return (
              <TextBlock
                key={index}
                block={block}
                index={index}
                onUpdate={updateBlock}
                onMove={moveBlock}
                onDelete={deleteBlock}
              />
            );
          }

          if (block.type === "image") {
            return (
              <ImageBlock
                key={index}
                block={block}
                index={index}
                onMove={moveBlock}
                onDelete={deleteBlock}
              />
            );
          }

          return null;
        })}

        <div className="note-add-buttons">
          <button onClick={addTextBlock}>+ Text</button>

          <button onClick={addImageBlock}>+ Image</button>
        </div>
      </div>
    </div>
  );
}
