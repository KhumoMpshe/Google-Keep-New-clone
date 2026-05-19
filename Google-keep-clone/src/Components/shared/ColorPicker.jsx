import { useState, useEffect } from 'react'
import { KEEP_COLORS } from '../../utils/noteHelpers.js'
import './ColorPicker.css'

function clamp(v, a = 0, b = 255) {
  return Math.max(a, Math.min(b, Math.round(v)))
}

function adjustHex(hex, factor) {
  // factor in [-1,1], negative -> darker, positive -> lighter
  if (!hex || typeof hex !== 'string') return hex
  const h = hex.replace('#', '')
  if (h.length !== 6) return hex
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  const nr = clamp(r * (1 + factor))
  const ng = clamp(g * (1 + factor))
  const nb = clamp(b * (1 + factor))
  return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`
}

export default function ColorPicker({ selectedColor, onSelect, onClose }) {
  const [theme, setTheme] = useState('light')
  const darkFactor = -0.18

  useEffect(() => {
    // Get initial theme
    const initialTheme = document.documentElement.dataset.theme || 'light'
    setTheme(initialTheme)

    // Listen for theme changes on the root element
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.dataset.theme || 'light'
      setTheme(newTheme)
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => observer.disconnect()
  }, [])

  const toDisplayColor = (base) => (theme === 'dark' ? adjustHex(base, darkFactor) : base)

  return (
    <div className="color-picker" onClick={(e) => e.stopPropagation()}>
      <p className="color-picker__label">Background color</p>
      <div className="color-picker__grid">
        {KEEP_COLORS.map((color) => {
          const displayBg = toDisplayColor(color.bg)
          const isActive = selectedColor && (selectedColor.toLowerCase() === displayBg.toLowerCase() || selectedColor.toLowerCase() === color.bg.toLowerCase())
          return (
            <button
              key={color.id}
              type="button"
              className={`color-picker__swatch ${isActive ? 'color-picker__swatch--active' : ''}`}
              style={{ backgroundColor: displayBg, borderColor: color.border }}
              title={color.id}
              onClick={() => {
                onSelect(displayBg)
                onClose?.()
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
