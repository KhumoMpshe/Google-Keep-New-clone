import { useEffect, useRef, useState } from 'react'
import { FormActions } from '../Form/Form.jsx'
import RichTextEditor from '../shared/RichTextEditor.jsx'
import { adjustHex } from '../shared/ColorPicker.jsx'
import './Modal.css'

export default function Modal({
  isOpen,
  editingNote,
  onClose,
  onUpdate,
  onArchive,
}) {
  const modalFormRef = useRef(null)
  const closeButtonRef = useRef(null)
  const textEditorRef = useRef(null)
  const [theme, setTheme] = useState('light')

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

  useEffect(() => {
    function handleCloseModal(event) {
      if (!isOpen) return

      const isNoteClicked = event.target.closest('.note')
      const isModalFormClicked = modalFormRef.current?.contains(event.target)
      const isCloseButtonClicked = closeButtonRef.current?.contains(event.target)
      const isOverlay = event.target.classList.contains('modal')

      if (isNoteClicked) return
      if (isOverlay || !isModalFormClicked || isCloseButtonClicked) {
        onClose()
      }
    }

    document.body.addEventListener('click', handleCloseModal)
    return () => document.body.removeEventListener('click', handleCloseModal)
  }, [isOpen, onClose])

  if (!isOpen || !editingNote) {
    return null
  }

  // Apply dark mode adjustment to form colors
  const darkFactor = -0.18
  const baseColor = editingNote.backgroundColor || '#ffffff'
  const displayColor = theme === 'dark' && baseColor !== '#ffffff' ? adjustHex(baseColor, darkFactor) : baseColor

  let reminderText = null
  if (editingNote.reminder?.date) {
    const dateStr = `${editingNote.reminder.date}T${editingNote.reminder.time || '09:00'}`
    reminderText = new Date(dateStr).toLocaleString()
  }

  return (
    <div className="modal open-modal">
      <div className="modal-content">
        <div className="form-container" style={{ backgroundColor: displayColor }}>
          <form
            ref={modalFormRef}
            className="form"
            id="modal-form"
            onSubmit={(e) => e.preventDefault()}
          >
            {reminderText ? (
              <div className="form-reminder-badge">
                <span className="material-symbols-outlined">notifications</span>
                <span>{reminderText}</span>
              </div>
            ) : null}
            <input
              type="text"
              className="note-title"
              placeholder="Title"
              value={editingNote.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
            <RichTextEditor
              value={editingNote.text}
              onChange={(html) => onUpdate({ text: html })}
              editorRef={textEditorRef}
            />
            <FormActions
              onClose={onClose}
              closeButtonType="button"
              closeButtonRef={closeButtonRef}
              noteMeta={editingNote}
              onMetaChange={onUpdate}
              textEditorRef={textEditorRef}
              onArchiveClick={onArchive}
            />
          </form>
        </div>
      </div>
    </div>
  )
}