import { useEffect, useRef, useState } from 'react'
import FormatToolbar from '../shared/FormatToolbar.jsx'
import ColorPicker from '../shared/ColorPicker.jsx'
import ReminderPicker from '../shared/ReminderPicker.jsx'
import MoreMenu from '../shared/MoreMenu.jsx'
import CollaboratorModal from '../shared/CollaboratorModal.jsx'
import RichTextEditor from '../shared/RichTextEditor.jsx'
import { adjustHex } from '../shared/ColorPicker.jsx'
import { getPlainText } from '../../utils/noteHelpers.js'
import './Form.css'

function FormPin() {
  return (
    <div
      className="tooltip form-pin"
      onClick={(event) => event.stopPropagation()}
    >
      <span className="material-symbols-outlined hover small-icon">push_pin</span>
      <span className="tooltip-text">Pin note</span>
    </div>
  )
}

const emptyDraft = () => ({
  title: '',
  text: '',
  backgroundColor: '#ffffff',
  reminder: null,
  collaborators: [],
})

export function FormActions({
  onClose,
  closeButtonType = 'button',
  closeButtonRef,
  undoRedo,
  noteMeta,
  onMetaChange,
  textEditorRef,
  onArchiveClick,
  showArchive = true,
}) {
  const [openPopup, setOpenPopup] = useState(null)
  const [showCollabModal, setShowCollabModal] = useState(false)

  const canUndo = undoRedo?.canUndo ?? false
  const canRedo = undoRedo?.canRedo ?? false

  const closePopups = () => setOpenPopup(null)

  const handleFormat = (command, value) => {
    const el = textEditorRef?.current
    if (!el) return
    el.focus()
    if (command === 'formatBlock' && value) {
      document.execCommand('formatBlock', false, value)
    } else {
      document.execCommand(command, false, value || null)
    }
    onMetaChange?.({ text: el.innerHTML })
  }

  const togglePopup = (name, event) => {
    event.stopPropagation()
    setOpenPopup((prev) => (prev === name ? null : name))
  }

  const addCollaborator = (email) => {
    onMetaChange?.({
      collaborators: [...(noteMeta?.collaborators || []), email],
    })
  }

  const removeCollaborator = (email) => {
    onMetaChange?.({
      collaborators: (noteMeta?.collaborators || []).filter((c) => c !== email),
    })
  }

  return (
    <div className="form-actions">
      <div className="icons">
        <div className="tooltip icon-popup-anchor">
          <button
            type="button"
            className="form-icon-btn"
            onClick={(e) => togglePopup('format', e)}
            aria-label="Formatting options"
          >
            <span className="material-symbols-outlined hover small-icon">text_format</span>
          </button>
          <span className="tooltip-text">Formatting options</span>
          {openPopup === 'format' && (
            <FormatToolbar onFormat={handleFormat} editorRef={textEditorRef} />
          )}
        </div>

        <div className="tooltip icon-popup-anchor">
          <button
            type="button"
            className="form-icon-btn"
            onClick={(e) => togglePopup('color', e)}
            aria-label="Change color"
          >
            <span className="material-symbols-outlined hover small-icon">palette</span>
          </button>
          <span className="tooltip-text">Change Color</span>
          {openPopup === 'color' && noteMeta && (
            <ColorPicker
              selectedColor={noteMeta.backgroundColor}
              onSelect={(bg) => onMetaChange?.({ backgroundColor: bg })}
              onClose={closePopups}
            />
          )}
        </div>

        <div className="tooltip icon-popup-anchor">
          <button
            type="button"
            className="form-icon-btn"
            onClick={(e) => togglePopup('reminder', e)}
            aria-label="Remind me"
          >
            <span className="material-symbols-outlined hover small-icon">add_alert</span>
          </button>
          <span className="tooltip-text">Remind me</span>
          {openPopup === 'reminder' && noteMeta && (
            <ReminderPicker
              reminder={noteMeta.reminder}
              onSave={(reminder) => onMetaChange?.({ reminder })}
              onClear={() => onMetaChange?.({ reminder: null })}
              onClose={closePopups}
            />
          )}
        </div>

        <div className="tooltip">
          <button
            type="button"
            className="form-icon-btn"
            onClick={(e) => {
              e.stopPropagation()
              setShowCollabModal(true)
            }}
            aria-label="Collaborator"
          >
            <span className="material-symbols-outlined hover small-icon">person_add</span>
          </button>
          <span className="tooltip-text">Collaborator</span>
        </div>

        <div className="tooltip">
          <span className="material-symbols-outlined hover small-icon">image</span>
          <span className="tooltip-text">Add Image</span>
        </div>

        {showArchive && onArchiveClick && (
          <div className="tooltip">
            <button
              type="button"
              className="form-icon-btn"
              onClick={(e) => {
                e.stopPropagation()
                onArchiveClick()
              }}
              aria-label="Archive"
            >
              <span className="material-symbols-outlined hover small-icon">archive</span>
            </button>
            <span className="tooltip-text">Archive</span>
          </div>
        )}

        <div className="tooltip icon-popup-anchor">
          <button
            type="button"
            className="form-icon-btn"
            onClick={(e) => togglePopup('more', e)}
            aria-label="More"
          >
            <span className="material-symbols-outlined hover small-icon">more_vert</span>
          </button>
          <span className="tooltip-text">More</span>
          {openPopup === 'more' && <MoreMenu onClose={closePopups} />}
        </div>

        <div className="tooltip">
          <button
            type="button"
            className={`form-icon-btn ${canUndo ? '' : 'form-icon-btn--muted'}`}
            disabled={!canUndo}
            onClick={(event) => {
              event.stopPropagation()
              undoRedo?.onUndo?.()
            }}
            aria-label="Undo"
          >
            <span className="material-symbols-outlined small-icon">undo</span>
          </button>
          <span className="tooltip-text">Undo</span>
        </div>

        <div className="tooltip">
          <button
            type="button"
            className={`form-icon-btn ${canRedo ? '' : 'form-icon-btn--muted'}`}
            disabled={!canRedo}
            onClick={(event) => {
              event.stopPropagation()
              undoRedo?.onRedo?.()
            }}
            aria-label="Redo"
          >
            <span className="material-symbols-outlined small-icon">redo</span>
          </button>
          <span className="tooltip-text">Redo</span>
        </div>
      </div>

      <button
        ref={closeButtonRef}
        type={closeButtonType}
        className="close-btn"
        onClick={onClose}
      >
        close
      </button>

      {showCollabModal && noteMeta && (
        <CollaboratorModal
          collaborators={noteMeta.collaborators || []}
          onAdd={addCollaborator}
          onRemove={removeCollaborator}
          onClose={() => setShowCollabModal(false)}
        />
      )}
    </div>
  )
}

export default function Form({ onAddNote }) {
  const [isActive, setIsActive] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])
  const [theme, setTheme] = useState('light')

  const inactiveFormRef = useRef(null)
  const activeFormRef = useRef(null)
  const textEditorRef = useRef(null)

  // Listen to theme changes
  useEffect(() => {
    const initialTheme = document.documentElement.dataset.theme || 'light'
    setTheme(initialTheme)

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.dataset.theme || 'light'
      setTheme(newTheme)
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => observer.disconnect()
  }, [])

  const { title, text, backgroundColor, reminder, collaborators } = draft

  const updateDraft = (updates) => {
    setDraft((prev) => ({ ...prev, ...updates }))
  }

  const closeActiveForm = () => {
    setIsActive(false)
    setDraft(emptyDraft())
    setPast([])
    setFuture([])
  }

  const pushHistoryBeforeChange = () => {
    setPast((prev) => [...prev, { title, text }])
    setFuture([])
  }

  const handleTitleChange = (event) => {
    pushHistoryBeforeChange()
    updateDraft({ title: event.target.value })
  }

  const handleTextChange = (html) => {
    pushHistoryBeforeChange()
    updateDraft({ text: html })
  }

  const handleUndo = () => {
    if (past.length === 0) return
    const previous = past[past.length - 1]
    setFuture((f) => [{ title, text }, ...f])
    setPast((p) => p.slice(0, -1))
    updateDraft(previous)
  }

  const handleRedo = () => {
    if (future.length === 0) return
    const next = future[0]
    setPast((p) => [...p, { title, text }])
    setFuture((f) => f.slice(1))
    updateDraft(next)
  }

  const undoRedo = {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    onUndo: handleUndo,
    onRedo: handleRedo,
  }

  const saveNote = (extra = {}) => {
    if (getPlainText(text) === '' && !title.trim()) return false
    onAddNote({ ...draft, ...extra })
    return true
  }

  const saveAndClose = () => {
    if (saveNote()) closeActiveForm()
  }

  const handleArchiveFromForm = () => {
    if (saveNote({ archived: true })) {
      closeActiveForm()
    }
  }

  useEffect(() => {
    const handleFormClick = (event) => {
      const isActiveFormClicked = activeFormRef.current?.contains(event.target)
      const isInactiveFormClicked = inactiveFormRef.current?.contains(event.target)

      if (isInactiveFormClicked) {
        setPast([])
        setFuture([])
        setIsActive(true)
      } else if (!isInactiveFormClicked && !isActiveFormClicked && isActive) {
        saveNote()
        closeActiveForm()
      }
    }

    document.body.addEventListener('click', handleFormClick)
    return () => document.body.removeEventListener('click', handleFormClick)
  }, [isActive, draft, onAddNote])

  const handleSubmit = (event) => {
    event.preventDefault()
    saveAndClose()
  }

  // Apply dark mode adjustment to form colors
  const darkFactor = -0.18
  const displayColor = theme === 'dark' && backgroundColor !== '#ffffff' ? adjustHex(backgroundColor, darkFactor) : backgroundColor
  const displayBorder = theme === 'dark' && backgroundColor !== '#ffffff' ? adjustHex(backgroundColor, darkFactor) : (backgroundColor !== '#ffffff' ? backgroundColor : undefined)

  const formContainerStyle = {
    backgroundColor: displayColor,
    borderColor: displayBorder,
  }

  return (
    <>
      <div
        ref={inactiveFormRef}
        className="form-container inactive-form"
        style={{ display: isActive ? 'none' : 'block' }}
      >
        <form>
          <input
            type="text"
            className="note-text"
            placeholder="Take a note..."
            readOnly
          />
          <div className="form-actions">
            <div className="tooltip">
              <span className="material-symbols-outlined hover">check_box</span>
              <span className="tooltip-text">New List</span>
            </div>
            <div className="tooltip">
              <span className="material-symbols-outlined hover">brush</span>
              <span className="tooltip-text">New Drawing</span>
            </div>
            <div className="tooltip">
              <span className="material-symbols-outlined hover">image</span>
              <span className="tooltip-text">New Image</span>
            </div>
          </div>
        </form>
      </div>

      <div
        ref={activeFormRef}
        className="form-container active-form"
        style={{ display: isActive ? 'block' : 'none', ...formContainerStyle }}
      >
        <FormPin />
        {reminder?.date && (
          <div className="form-reminder-badge">
            <span className="material-symbols-outlined">notifications</span>
            <span>
              {new Date(`${reminder.date}T${reminder.time || '09:00'}`).toLocaleString()}
            </span>
          </div>
        )}
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="note-title"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />
          <RichTextEditor
            value={text}
            onChange={handleTextChange}
            editorRef={textEditorRef}
          />
          <FormActions
            onClose={saveAndClose}
            closeButtonType="button"
            undoRedo={undoRedo}
            noteMeta={draft}
            onMetaChange={updateDraft}
            textEditorRef={textEditorRef}
            onArchiveClick={handleArchiveFromForm}
          />
        </form>
      </div>
    </>
  )
}
