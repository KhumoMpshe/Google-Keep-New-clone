// Google Keep–style background colors
export const KEEP_COLORS = [
  { id: 'default', bg: '#ffffff', border: '#e0e1e0' },
  { id: 'coral', bg: '#f28b82', border: '#f28b82' },
  { id: 'orange', bg: '#fbbc04', border: '#fbbc04' },
  { id: 'yellow', bg: '#fff475', border: '#fff475' },
  { id: 'green', bg: '#ccff90', border: '#ccff90' },
  { id: 'teal', bg: '#a7ffeb', border: '#a7ffeb' },
  { id: 'blue', bg: '#cbf0f8', border: '#cbf0f8' },
  { id: 'dark-blue', bg: '#aecbfa', border: '#aecbfa' },
  { id: 'purple', bg: '#d7aefb', border: '#d7aefb' },
  { id: 'pink', bg: '#fdcfe8', border: '#fdcfe8' },
  { id: 'brown', bg: '#e6c9a8', border: '#e6c9a8' },
  { id: 'gray', bg: '#e8eaed', border: '#e8eaed' },
]

export const DEFAULT_NOTE_FIELDS = {
  backgroundColor: '#ffffff',
  reminder: null,
  collaborators: [],
  archived: false,
}

/** Ensure older saved notes have all fields */
export function normalizeNote(note) {
  return {
    ...DEFAULT_NOTE_FIELDS,
    ...note,
    collaborators: Array.isArray(note.collaborators) ? note.collaborators : [],
  }
}

export function normalizeNotes(notes) {
  return (notes || []).map(normalizeNote)
}

export function createNote({ title = '', text = '', ...rest }) {
  return normalizeNote({
    id: crypto.randomUUID(),
    title,
    text,
    ...rest,
  })
}

/** Plain text from HTML (for empty checks) */
export function getPlainText(htmlOrText) {
  if (!htmlOrText) return ''
  const div = document.createElement('div')
  div.innerHTML = htmlOrText
  return (div.textContent || '').trim()
}

export function formatReminderLabel(reminder) {
  if (!reminder?.date) return ''
  const date = new Date(`${reminder.date}T${reminder.time || '09:00'}`)
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
