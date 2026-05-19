import { useState } from 'react'
import './CollaboratorModal.css'

export default function CollaboratorModal({
  collaborators = [],
  onAdd,
  onRemove,
  onClose,
}) {
  const [email, setEmail] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (trimmed && !collaborators.includes(trimmed)) {
      onAdd(trimmed)
      setEmail('')
    }
  }

  return (
    <div className="collab-overlay" onClick={onClose}>
      <div className="collab-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="collab-modal__title">Collaborators</h3>
        <p className="collab-modal__subtitle">
          Add emails to share this note with family or teammates.
        </p>
        <form onSubmit={handleAdd} className="collab-modal__form">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <ul className="collab-modal__list">
          {collaborators.length === 0 && (
            <li className="collab-modal__empty">No collaborators yet</li>
          )}
          {collaborators.map((person) => (
            <li key={person}>
              <span className="material-symbols-outlined">person</span>
              <span>{person}</span>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => onRemove(person)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="collab-modal__done" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}
