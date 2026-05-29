import { useState } from 'react'
import './Sidebar.css'

const sidebarItems = [
  { id: 'notes', icon: 'lightbulb', label: 'Notes', view: 'notes' },
  { id: 'reminders', icon: 'notifications', label: 'Reminders', view: 'notes' },
  { id: 'labels', icon: 'edit', label: 'Edit Labels', view: 'notes' },
  { id: 'archive', icon: 'archive', label: 'Archive', view: 'archive' },
  { id: 'trash', icon: 'delete', label: 'Trash', view: 'notes' },
]

export default function Sidebar({ activeView = 'notes', onViewChange, isExpanded = true, onToggleExpand }) {
  const handleItemClick = (item) => {
    if (item.view && onViewChange) {
      onViewChange(item.view)
    }
  }

  return (
    <div
      className={`sidebar ${isExpanded ? 'sidebar-hover' : ''}`}
      style={{ width: isExpanded ? '250px' : '80px', transition: 'width 0.3s ease' }}
      onMouseEnter={() => onToggleExpand?.(true)}
      onMouseLeave={() => onToggleExpand?.(false)}
    >

      {sidebarItems.map((item) => {
        const isActive =
          item.id === 'archive'
            ? activeView === 'archive'
            : item.id === 'notes' && activeView === 'notes'

        return (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            className={`sidebar-item ${
              isActive && isExpanded
                ? 'sidebar-active-item active-item'
                : isActive
                  ? 'active-item'
                  : ''
            }`}
            onClick={() => handleItemClick(item)}
            onKeyDown={(e) => e.key === 'Enter' && handleItemClick(item)}
          >
            <span
              className={`material-symbols-outlined hover ${isActive ? 'active' : ''}`}
            >
              {item.icon}
            </span>
            <span className="sidebar-text">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
