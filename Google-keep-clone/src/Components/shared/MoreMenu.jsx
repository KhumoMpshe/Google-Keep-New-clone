import './MoreMenu.css'

const menuItems = [
  { id: 'label', label: 'Add label' },
  { id: 'drawing', label: 'Add drawing' },
  { id: 'tickboxes', label: 'Show tick boxes' },
  { id: 'history', label: 'Version history' },
]

export default function MoreMenu({ onClose }) {
  const handleSelect = () => {
    onClose?.()
  }

  return (
    <div className="more-menu" onClick={(e) => e.stopPropagation()}>
      <ul className="more-menu__list">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="more-menu__item"
              onClick={handleSelect}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
