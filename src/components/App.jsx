import React from 'react';
import { getInitialData } from '../utils';
import NoteInput from './NoteInput';
import NotesList from './NotesList';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: getInitialData(),
      searchKeyword: '',
      selectedNote: null,
    };

    this.onAddNoteHandler = this.onAddNoteHandler.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onArchiveHandler = this.onArchiveHandler.bind(this);
    this.onSearchChangeHandler = this.onSearchChangeHandler.bind(this);
    this.onSelectNoteHandler = this.onSelectNoteHandler.bind(this);
    this.onCloseModalHandler = this.onCloseModalHandler.bind(this);
  }

  onAddNoteHandler({ title, body }) {
    // Gunakan find() untuk cek apakah judul sudah ada (Array Function)
    const isDuplicate = this.state.notes.find(
      (note) => note.title.toLowerCase() === title.toLowerCase()
    );

    if (isDuplicate) {
      alert('Catatan dengan judul yang sama sudah ada!');
      return;
    }

    this.setState((prevState) => ({
      notes: [
        ...prevState.notes,
        {
          id: +new Date(),
          title,
          body,
          createdAt: new Date().toISOString(),
          archived: false,
        },
      ],
    }));
  }

  onDeleteHandler(id) {
    this.setState((prevState) => ({
      notes: prevState.notes.filter((note) => note.id !== id),
      selectedNote: prevState.selectedNote?.id === id ? null : prevState.selectedNote,
    }));
  }

  onArchiveHandler(id) {
    this.setState((prevState) => ({
      notes: prevState.notes.map((note) => {
        if (note.id === id) {
          return { ...note, archived: !note.archived };
        }
        return note;
      }),
      selectedNote:
        prevState.selectedNote?.id === id
          ? { ...prevState.selectedNote, archived: !prevState.selectedNote.archived }
          : prevState.selectedNote,
    }));
  }

  onSearchChangeHandler(event) {
    const { value } = event.target;
    this.setState(() => ({
      searchKeyword: value,
    }));
  }

  onSelectNoteHandler(note) {
    this.setState(() => ({
      selectedNote: note,
    }));
  }

  onCloseModalHandler() {
    this.setState(() => ({
      selectedNote: null,
    }));
  }

  render() {
    const { notes, searchKeyword, selectedNote } = this.state;

    // Array Function: filter() untuk pencarian
    const filteredNotes = notes.filter((note) =>
      note.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    // Array Function: filter() untuk memisah aktif & arsip
    const activeNotes = filteredNotes.filter((note) => !note.archived);
    const archivedNotes = filteredNotes.filter((note) => note.archived);

    return (
      <div className="note-app" data-testid="note-app">
        <div className="note-app__header" data-testid="note-app-header">
          <div className="note-app__brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <span style={{ fontSize: '32px', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>𓊆ྀི❤︎𓊇ྀི</span>
            <h1 style={{ margin: 0 }}>kawaiiNotes</h1>
          </div>
          <div className="note-search" data-testid="note-search">
            <input
              type="text"
              placeholder="Cari catatan..."
              value={searchKeyword}
              onChange={this.onSearchChangeHandler}
              data-testid="note-search-input"
            />
          </div>
        </div>
        <div className="note-app__body" data-testid="note-app-body">
          <NoteInput addNote={this.onAddNoteHandler} />
          <section
            aria-labelledby="active-notes-title"
            data-testid="active-notes-section"
          >
            <h2 id="active-notes-title">Catatan Aktif</h2>
            <NotesList
              notes={activeNotes}
              onDelete={this.onDeleteHandler}
              onArchive={this.onArchiveHandler}
              searchKeyword={searchKeyword}
              onSelectNote={this.onSelectNoteHandler}
              dataTestId="active-notes-list"
            />
          </section>
          <section
            aria-labelledby="archived-notes-title"
            data-testid="archived-notes-section"
          >
            <h2 id="archived-notes-title">Arsip</h2>
            <NotesList
              notes={archivedNotes}
              onDelete={this.onDeleteHandler}
              onArchive={this.onArchiveHandler}
              searchKeyword={searchKeyword}
              onSelectNote={this.onSelectNoteHandler}
              dataTestId="archived-notes-list"
            />
          </section>
        </div>

        {selectedNote && (
          <div className="modal-overlay" onClick={this.onCloseModalHandler}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={this.onCloseModalHandler}>✖</button>
              <h2 style={{ color: '#c2185b', marginBottom: '8px', paddingRight: '24px' }}>{selectedNote.title}</h2>
              <p style={{ color: '#f06292', fontSize: '14px', marginBottom: '24px', fontWeight: 'bold' }}>
                {new Date(selectedNote.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p style={{ color: '#4a4a4a', lineHeight: '1.6', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                {selectedNote.body}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
