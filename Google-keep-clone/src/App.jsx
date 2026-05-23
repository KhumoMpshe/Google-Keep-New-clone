import { useEffect, useRef, useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import Sidebar from './Components/Sidebar/Sidebar.jsx'
import Form from './Components/Form/Form.jsx'
import Notes from './Components/Notes/Notes.jsx'
import Modal from './Components/Modal/Modal.jsx'
import ArchiveToast from './Components/shared/ArchiveToast.jsx'
import {
  createNote,
  normalizeNotes,
  getPlainText,
} from './utils/noteHelpers.js'

function App() {
  const [notes, setNotes] = useState(() =>
    normalizeNotes(JSON.parse(localStorage.getItem('notes')) || [])
  )
  const [view, setView] = useState('notes')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [archiveToast, setArchiveToast] = useState(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
  })
  const archiveTimerRef = useRef(null)

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev)
  }

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const showArchiveToast = (archivedNote) => {
    if (archiveTimerRef.current) clearTimeout(archiveTimerRef.current)
    setArchiveToast({ note: archivedNote })
    archiveTimerRef.current = setTimeout(() => {
      setArchiveToast(null)
    }, 5000)
  }

  const addNote = (noteData) => {
    const plain = getPlainText(noteData.text)
    if (!plain && !noteData.title?.trim()) return

    const newNote = createNote({
      title: noteData.title || '',
      text: noteData.text || '',
      backgroundColor: noteData.backgroundColor || '#ffffff',
      reminder: noteData.reminder || null,
      collaborators: noteData.collaborators || [],
      archived: noteData.archived || false,
    })
    setNotes((prev) => [...prev, newNote])

    if (newNote.archived) {
      showArchiveToast(newNote)
    }
  }

  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...updates } : note))
    )
    setEditingNote((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    )
  }

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    if (editingNote?.id === id) {
      setIsModalOpen(false)
      setEditingNote(null)
    }
  }

  const archiveNote = (id) => {
    const note = notes.find((n) => n.id === id)
    if (!note || note.archived) return

    const archived = { ...note, archived: true }
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? archived : n))
    )
    showArchiveToast(archived)

    if (editingNote?.id === id) {
      setIsModalOpen(false)
      setEditingNote(null)
    }
  }

  const undoArchive = () => {
    if (!archiveToast?.note) return
    const { id } = archiveToast.note
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: false } : n))
    )
    setArchiveToast(null)
    if (archiveTimerRef.current) clearTimeout(archiveTimerRef.current)
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const saveEditingNote = () => {
    if (editingNote) {
      updateNote(editingNote.id, {
        title: editingNote.title,
        text: editingNote.text,
        backgroundColor: editingNote.backgroundColor,
        reminder: editingNote.reminder,
        collaborators: editingNote.collaborators,
      })
    }
  }

  const openModal = (id) => {
    if (isModalOpen) saveEditingNote()

    const note = notes.find((item) => item.id === id)
    if (note && !note.archived) {
      setEditingNote({ ...note })
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    saveEditingNote()
    setIsModalOpen(false)
    setEditingNote(null)
  }

  const updateEditingNote = (updates) => {
    setEditingNote((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  const visibleNotes = notes.filter((note) => {
    // Filter by archive/notes view
    const viewMatch = view === 'archive' ? note.archived : !note.archived
    
    // Filter by search term (case-insensitive)
    if (searchTerm.trim() === '') {
      return viewMatch
    }
    
    const searchLower = searchTerm.toLowerCase()
    const titleMatch = note.title.toLowerCase().includes(searchLower)
    const contentMatch = getPlainText(note.text).toLowerCase().includes(searchLower)
    
    return viewMatch && (titleMatch || contentMatch)
  })

  return (
    <>
      <Navbar onToggleSidebar={toggleSidebar} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main>
        <Sidebar activeView={view} onViewChange={setView} isExpanded={sidebarExpanded} onToggleExpand={setSidebarExpanded} />
        {view === 'notes' && (
          <Form onAddNote={addNote} />
        )}
        <Notes
          notes={visibleNotes}
          view={view}
          searchTerm={searchTerm}
          onNoteClick={openModal}
          onArchiveNote={archiveNote}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
        />
        <Modal
          isOpen={isModalOpen}
          editingNote={editingNote}
          onClose={closeModal}
          onUpdate={updateEditingNote}
          onArchive={() => editingNote && archiveNote(editingNote.id)}
        />
      </main>
      <ArchiveToast
        visible={!!archiveToast}
        onUndo={undoArchive}
      />
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className="material-symbols-outlined">
          {theme === 'light' ? 'dark_mode' : 'light_mode'}
        </span>
      </button>
    </>
  )
}

export default App
