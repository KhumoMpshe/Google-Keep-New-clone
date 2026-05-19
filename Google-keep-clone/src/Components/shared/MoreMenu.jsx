import './MoreMenu.css'

const menuItems = [
  { id: 'label', label: 'Add label' },
  { id: 'drawing', label: 'Add drawing' },
  { id: 'tickboxes', label: 'Show tick boxes' },
  { id: 'history', label: 'Version history' },
]

export default function MoreMenu({ items = menuItems, onClose, onSelect }) {
  const handleSelect = (itemId) => {
    onSelect?.(itemId)
    onClose?.()
  }

  return (
    <div className="more-menu" onClick={(e) => e.stopPropagation()}>
      <ul className="more-menu__list">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="more-menu__item"
              onClick={() => handleSelect(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
