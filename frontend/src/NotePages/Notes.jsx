import React, { useEffect, useState } from "react";
import { NoteEdit } from "./NoteEdit.jsx";
import "./Notes.css";
import { getLimitedNotes, deleteNote } from "./NoteData.jsx";

function NoteCard({ note, onClick, onDelete }) {
  return (
    <div className="note-card" onClick={onClick}>
      <div className="note-card-title">
        <strong>{note.title || "Untitled"}</strong>
      </div>

      <div className="note-card-content">
        {note.description?.length > 50
          ? `${note.description.slice(0, 50)}...`
          : note.description}

        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <div className="notes-pagination">
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            className={`notes-page-button ${
              page === pageNumber ? "active" : ""
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}
    </div>
  );
}

export function Notes() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const limit = 10;

  const handleSearchChange = (event) => {
    setText(event.target.value);
    setPage(1);
  };

  async function getNotes(searchText, currentPage) {
    setLoading(true);

    try {
      let result;

      if (searchText === "") {
        result = await getLimitedNotes({ page: currentPage });
      } else {
        result = await searchNotes(searchText, limit, currentPage);
      }
      setNotes(result);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getNotes(text, page);
  }, [text, page]);

  const handleCreate = () => {
    setCreating(true);
  };

  const handleNoteClick = (id) => {
    setSelectedId(id);
  };
  const handleNoteDelete = async(id) => {
    await deleteNote({ id: id })
    setNotes(prevNotes =>
      prevNotes.filter(note => note.id !== id)
    );  }

  const handleBack = async () => {
    setSelectedId(null);
    setCreating(false);
    const result = await getLimitedNotes({ page: page });
    setNotes(result);
  };

  if (creating) {
    return <NoteEdit id={null} onBack={handleBack} />;
  }
  if (selectedId) {
    return <NoteEdit id={selectedId} onBack={handleBack} />;
  }
  return (
    <div className="notes-page">
      <div className="notes-header">
        <div>
          <h1>Notes</h1>
          <div className="notes-subtitle">Your notes</div>
        </div>

        <button className="notes-create-button" onClick={handleCreate}>
          + New Draft
        </button>
      </div>

      <div className="notes-search">
        <input
          id="user-input"
          type="text"
          value={text}
          onChange={handleSearchChange}
          placeholder="Search notes..."
        />
      </div>

      <div className="notes-list">
        {loading && <div className="notes-message">Loading...</div>}

        {!loading && notes.length === 0 && (
          <div className="notes-message">No notes found.</div>
        )}

        {!loading &&
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => handleNoteClick(note.id)}
              onDelete={() => handleNoteDelete(note.id)}
            />
          ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
