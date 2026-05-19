import { useRef, useState } from 'react'
import ColorPicker from '../shared/ColorPicker.jsx'
import ReminderPicker from '../shared/ReminderPicker.jsx'
import CollaboratorModal from '../shared/CollaboratorModal.jsx'
import { formatReminderLabel } from '../../utils/noteHelpers.js'
import './Notes.css'

const footerIcons = [
  { id: 'format', icon: 'text_format', label: 'Formatting options' },
  { id: 'color', icon: 'palette', label: 'Change Color' },
  { id: 'reminder', icon: 'add_alert', label: 'Remind me' },
  { id: 'collaborate', icon: 'person_add', label: 'Collaborator' },
  { id: 'image', icon: 'image', label: 'Add Image' },
  { id: 'archive', icon: 'archive', label: 'Archive', className: 'archive' },
  { id: 'more', icon: 'more_vert', label: 'More' },
]

function NoteCard({ note, onNoteClick, onArchiveNote, onUpdateNote }) {
  const [openPopup, setOpenPopup] = useState(null)
  const [showCollabModal, setShowCollabModal] = useState(false)
  const textPreviewRef = useRef(null)

  const handleClick = (event) => {
    if (
      event.target.closest('.archive') ||
      event.target.closest('.note-footer') ||
      event.target.closest('.pin-note')
    ) {
      return
    }
    onNoteClick(note.id)
  }

  const handleFooterIcon = (item, event) => {
    event.stopPropagation()

    if (item.id === 'archive') {
      onArchiveNote(note.id)
      return
    }
    if (item.id === 'collaborate') {
      setShowCollabModal(true)
      return
    }
    if (item.id === 'format' || item.id === 'color' || item.id === 'reminder') {
      setOpenPopup((prev) => (prev === item.id ? null : item.id))
    }
  }

  const noteStyle = {
    backgroundColor: note.backgroundColor || '#ffffff',
    borderColor:
      note.backgroundColor && note.backgroundColor !== '#ffffff'
        ? note.backgroundColor
        : '#e0e1e0',
  }

  return (
    <>
      <div
        className="note"
        id={note.id}
        style={noteStyle}
        onClick={handleClick}
      >
        <span className="material-symbols-outlined check-circle">
          check_circle
        </span>
        <div
          className="tooltip pin-note"
          onClick={(event) => event.stopPropagation()}
        >
          <span className="material-symbols-outlined hover small-icon">push_pin</span>
          <span className="tooltip-text">Pin note</span>
        </div>

        {note.reminder?.date && (
          <div className="note-reminder">
            <span className="material-symbols-outlined">notifications</span>
            <span>{formatReminderLabel(note.reminder)}</span>
          </div>
        )}

        {note.collaborators?.length > 0 && (
          <div className="note-collaborators">
            <span className="material-symbols-outlined">group</span>
            <span>{note.collaborators.length} collaborator(s)</span>
          </div>
        )}

        <div className="title">{note.title}</div>
        <div
          className="text"
          ref={textPreviewRef}
          dangerouslySetInnerHTML={{ __html: note.text || '' }}
        />

        <div className="note-footer" onClick={(e) => e.stopPropagation()}>
          {footerIcons.map((item) => (
            <div
              key={item.id}
              className={`tooltip icon-popup-anchor ${item.className || ''}`.trim()}
            >
              <button
                type="button"
                className="form-icon-btn note-footer-btn"
                onClick={(e) => handleFooterIcon(item, e)}
              >
                <span className="material-symbols-outlined hover small-icon">
                  {item.icon}
                </span>
              </button>
              <span className="tooltip-text">{item.label}</span>

              {openPopup === 'color' && item.id === 'color' && (
                <ColorPicker
                  selectedColor={note.backgroundColor}
                  onSelect={(bg) => onUpdateNote(note.id, { backgroundColor: bg })}
                  onClose={() => setOpenPopup(null)}
                />
              )}
              {openPopup === 'reminder' && item.id === 'reminder' && (
                <ReminderPicker
                  reminder={note.reminder}
                  onSave={(reminder) => onUpdateNote(note.id, { reminder })}
                  onClear={() => onUpdateNote(note.id, { reminder: null })}
                  onClose={() => setOpenPopup(null)}
                />
              )}
            </div>
          ))}
        </div>

        {openPopup === 'format' && (
          <div
            className="note-format-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="note-format-hint">Open note to apply formatting</p>
            <button type="button" onClick={() => onNoteClick(note.id)}>
              Edit note
            </button>
          </div>
        )}
      </div>

      {showCollabModal && (
        <CollaboratorModal
          collaborators={note.collaborators || []}
          onAdd={(email) =>
            onUpdateNote(note.id, {
              collaborators: [...(note.collaborators || []), email],
            })
          }
          onRemove={(email) =>
            onUpdateNote(note.id, {
              collaborators: (note.collaborators || []).filter((c) => c !== email),
            })
          }
          onClose={() => setShowCollabModal(false)}
        />
      )}
    </>
  )
}

export default function Notes({ notes, view, onNoteClick, onArchiveNote, onUpdateNote }) {
  if (notes.length === 0) {
    return (
      <div className="notes notes--empty">
        <p>
          {view === 'archive'
            ? 'No archived notes'
            : 'No notes yet. Click "Take a note..." to create one.'}
        </p>
      </div>
    )
  }

  return (
    <div className="notes">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onNoteClick={onNoteClick}
          onArchiveNote={onArchiveNote}
          onUpdateNote={onUpdateNote}
        />
      ))}
    </div>
  )
}
