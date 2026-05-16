import './Navbar.css'
import notesIcon from '../../assets/notes.svg'
import remindersIcon from '../../assets/reminders.svg'
import editIcon from '../../assets/edit.svg'
import archiveIcon from '../../assets/archive.svg'
import binIcon from '../../assets/bin.svg'

const navItems = [
  { id: 'notes', label: 'Notes', icon: notesIcon },
  { id: 'reminders', label: 'Reminders', icon: remindersIcon },
  { id: 'edit', label: 'Edit labels', icon: editIcon },
  { id: 'archive', label: 'Archive', icon: archiveIcon },
  { id: 'bin', label: 'Bin', icon: binIcon },
]

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">
          K
        </span>
        <span className="navbar__title">Keep</span>
      </div>

      <ul className="navbar__list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button type="button" className="navbar__item">
              <img src={item.icon} alt="" className="navbar__icon" />
              <span className="navbar__label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
