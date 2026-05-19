import { KEEP_COLORS } from '../../utils/noteHelpers.js'
import './ColorPicker.css'

export default function ColorPicker({ selectedColor, onSelect, onClose }) {
  return (
    <div className="color-picker" onClick={(e) => e.stopPropagation()}>
      <p className="color-picker__label">Background color</p>
      <div className="color-picker__grid">
        {KEEP_COLORS.map((color) => (
          <button
            key={color.id}
            type="button"
            className={`color-picker__swatch ${selectedColor === color.bg ? 'color-picker__swatch--active' : ''}`}
            style={{ backgroundColor: color.bg, borderColor: color.border }}
            title={color.id}
            onClick={() => {
              onSelect(color.bg)
              onClose?.()
            }}
          />
        ))}
      </div>
    </div>
  )
}
