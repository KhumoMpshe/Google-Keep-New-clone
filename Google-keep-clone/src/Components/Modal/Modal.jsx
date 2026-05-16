import { useState } from 'react'
import './Modal.css'
import searchIcon from '../../assets/search.svg'

export default function Modal() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleClose = () => {
    setIsExpanded(false)
    setTitle('')
    setContent('')
  }

  return (
    <section className="modal-area">
      <div className="search-bar">
        <img src={searchIcon} alt="" className="search-bar__icon" />
        <input
          type="search"
          className="search-bar__input"
          placeholder="Search"
          aria-label="Search notes"
        />
      </div>

      <div
        className={`note-modal ${isExpanded ? 'note-modal--expanded' : ''}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {isExpanded ? (
          <>
            <input
              type="text"
              className="note-modal__title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="note-modal__content"
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="note-modal__actions">
              <button type="button" className="note-modal__close" onClick={handleClose}>
                Close
              </button>
            </div>
          </>
        ) : (
          <p className="note-modal__placeholder">Take a note...</p>
        )}
      </div>
    </section>
  )
}
