import React, { useEffect, useState, useRef } from "react";
import "./NoteEdit.css";
import {
  getFullNotes,
  saveNewNote,
  createNewBlocks,
  orderNoteBlocks,
  patchNoteBlocks,
  patchNote,
  deleteNoteBlocks,
  deleteNote,
} from "./NoteData.jsx";

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
    id: null,
    title: "",
    description: "",
    category: "",
    date: null,
    noteblocks: [],
  });
  const [note, setNote] = useState(createNote());
  const [blocks, setBlocks] = useState([]);
  const saveTimers = useRef({});
  const titleSaveTimer = useRef(null);

  useEffect(() => {
    async function createNewNote() {
      setNote(createNote());
      const new_id = await saveNewNote({ notes: note });
      setNote({ ...note, id: new_id });
      setBlocks(note.noteblocks ?? []);
    }
    async function loadNote() {
      try {
        const data = await getFullNotes({ id: id });
        setNote(data);
        setBlocks(data.noteblocks ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    if (!id) {
      createNewNote();
    } else {
      loadNote();
    }
  }, [id]);
  const addBlock = async (blocktype) => {
    let id = null;
    id = await createNewBlocks({
      noteID: note.id,
      type: blocktype,
    });
    const newBlock = {
      id,
      content: "",
      type: blocktype,
      link: "",
    };

    setBlocks([...blocks, newBlock]);
  };
  const updateBlock = (index, content) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      content,
    };
    const block = newBlocks[index];
    if (block.id == null) {
      throw new Error("Cannot update block without an ID");
    }
    setBlocks(newBlocks);
    clearTimeout(saveTimers.current[block.id]);
    saveTimers.current[block.id] = setTimeout(() => {
      patchNoteBlocks({
        id: block.id,
        content,
      });
    }, 1000);
  };
  const moveBlock = async (index, direction) => {
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
    await orderNoteBlocks({
      id:note.id,
      block_list: newBlocks,
    });
  };
  const deleteBlock = async (index) => {
    if (note.id != null && blocks[index].id != null) {
      await deleteNoteBlocks({ id: blocks[index].id });
    }
    setBlocks(blocks.filter((_, blockIndex) => blockIndex !== index));
  };
  const handleNoteDelete = async () => {
    await deleteNote({ id: note.id });
    onBack();
  };
  const updateTitle = (title) => {
    setNote((prevNote) => ({
      ...prevNote,
      title: title,
    }));
    if (note.id == null) {
      throw new Error("Cannot update note without an ID");
    }
    clearTimeout(titleSaveTimer.current);
    titleSaveTimer.current = setTimeout(() => {
      patchNote({
        id: note.id,
        title: title
      });
    }, 1000);
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
          onChange={(event) => updateTitle(event.target.value)}
          placeholder="Untitled"
        />
        <button className="note-delete-button" onClick={handleNoteDelete}>
          Delete
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
          <button onClick={() => addBlock("text")}>+ Text</button>
          <button onClick={() => addBlock("image")}>+ Image</button>
        </div>
      </div>
    </div>
  );
}
