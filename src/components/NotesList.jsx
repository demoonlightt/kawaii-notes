import React from 'react';
import NoteItem from './NoteItem';

function NotesList({ notes, onDelete, onArchive, searchKeyword, onSelectNote, dataTestId = 'notes-list' }) {
  const hasNotes = notes && notes.length > 0;

  if (!hasNotes) {
    return (
      <div className="notes-list" data-testid={dataTestId}>
        <p
          className="notes-list__empty-message"
          data-testid={`${dataTestId}-empty`}
        >
          Tidak ada catatan
        </p>
      </div>
    );
  }

  // Sort notes by date descending
  const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Group notes
  const groupedNotes = sortedNotes.reduce((acc, note) => {
    const groupKey = new Date(note.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(note);
    return acc;
  }, {});

  return (
    <div className="notes-list" data-testid={dataTestId}>
      {Object.entries(groupedNotes).map(([groupKey, groupNotes]) => (
        <section key={groupKey} className="notes-group" data-testid={`${groupKey}-group`}>
          <h3 className="notes-group__title">{groupKey}</h3>
          <p className="notes-group__count" data-testid={`${groupKey}-group-count`}>
            {groupNotes.length} catatan
          </p>
          <div className="notes-group__list">
            {groupNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onDelete={onDelete}
                onArchive={onArchive}
                searchKeyword={searchKeyword}
                onSelectNote={onSelectNote}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default NotesList;
