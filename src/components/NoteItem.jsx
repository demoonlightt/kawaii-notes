import React from 'react';
import { showFormattedDate } from '../utils';

function NoteActionButton({ variant, onClick, dataTestId, children }) {
  return (
    <button
      className={`note-item__${variant}-button`}
      type="button"
      onClick={onClick}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
}

function NoteItem({ note, onDelete, onArchive, searchKeyword, onSelectNote }) {
  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? <mark key={i}>{part}</mark> : part
    );
  };

  return (
    <div
      className="note-item"
      data-testid="note-item"
      data-note-id={note?.id}
      onClick={() => onSelectNote(note)}
      style={{ cursor: 'pointer' }}
    >
      <div className="note-item__content" data-testid="note-item-content">
        <h3 className="note-item__title" data-testid="note-item-title">
          {highlightText(note.title, searchKeyword)}
        </h3>
        <p className="note-item__date" data-testid="note-item-date">
          {showFormattedDate(note.createdAt)}
        </p>
        <p 
          className="note-item__body" 
          data-testid="note-item-body"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {highlightText(note.body, searchKeyword)}
        </p>
      </div>
      <div 
        className="note-item__action" 
        data-testid="note-item-action"
        onClick={(e) => e.stopPropagation()}
      >
        <NoteActionButton
          variant="delete"
          onClick={() => onDelete(note.id)}
          dataTestId="note-item-delete-button"
        >
          Delete
        </NoteActionButton>

        <NoteActionButton
          variant="archive"
          onClick={() => onArchive(note.id)}
          dataTestId="note-item-archive-button"
        >
          {note.archived ? 'Pindahkan' : 'Arsipkan'}
        </NoteActionButton>
      </div>
    </div>
  );
}

export default NoteItem;
