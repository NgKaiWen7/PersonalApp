import React, { useEffect, useState } from "react";
import "./NoteEdit.css"

function TextBlock({
  block,
  index,
  onUpdate,
  onMove,
  onDelete,
}) {
  return (
    <div className="note-block">
      <textarea
        className="note-text-block"
        value={block.content}
        onChange={(event) =>
          onUpdate(index, event.target.value)
        }
        placeholder="Write something..."
        rows={3}
      />

      <div className="note-block-actions">
        <button
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
        >
          ↑
        </button>

        <button
          onClick={() => onMove(index, 1)}
          disabled={false}
        >
          ↓
        </button>

        <button
          onClick={() => onDelete(index)}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function ImageBlock({
  block,
  index,
  onMove,
  onDelete,
}) {
  // const imageUrl = getImageUrl(block.content);
  const imageUrl = ''
  return (
    <div className="note-block">
      {block.content ? (
        <img
          className="note-image-block"
          src={imageUrl}
          alt=""
        />
      ) : (
        <div className="note-image-placeholder">
          Image
        </div>
      )}

      <div className="note-block-actions">
        <button
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
        >
          ↑
        </button>

        <button
          onClick={() => onMove(index, 1)}
        >
          ↓
        </button>

        <button
          onClick={() => onDelete(index)}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function NoteEdit({ note, onBack }) {
  const [title, setTitle] = useState(note.title);
  const [blocks, setBlocks] = useState(note.blocks || []);

  if (!note) {
    return null;
  }

  const addTextBlock = () => {
    setBlocks([
      ...blocks,
      {
        type: "text",
        content: "",
        position: blocks.length,
      },
    ]);
  };

  const addImageBlock = () => {
    setBlocks([
      ...blocks,
      {
        type: "image",
        content: "",
        position: blocks.length,
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

    if (
      newIndex < 0 ||
      newIndex >= blocks.length
    ) {
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
    setBlocks(
      blocks.filter((_, blockIndex) => blockIndex !== index)
    );
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

    console.log("Saving note:", updatedNote);

    // TODO: call API
    // await updateNote(updatedNote);
  };

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <button
          className="note-back-button"
          onClick={onBack}
        >
          ←
        </button>

        <input
          className="note-title-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Untitled"
        />

        <button
          className="note-save-button"
          onClick={handleSave}
        >
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
          <button onClick={addTextBlock}>
            + Text
          </button>

          <button onClick={addImageBlock}>
            + Image
          </button>
        </div>
      </div>
    </div>
  );
}
