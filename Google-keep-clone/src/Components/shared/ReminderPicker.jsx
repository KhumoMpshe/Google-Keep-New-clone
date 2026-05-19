import { useMemo, useState } from 'react'
import './ReminderPicker.css'

function toReminderPayload(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return { date: `${y}-${m}-${d}`, time: `${h}:${min}` }
}

function formatTimeLabel(date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatPresetTimeLabel(date) {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const time = formatTimeLabel(date)

  if (date.toDateString() === now.toDateString()) {
    return time
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return time
  }

  const day = date.toLocaleDateString('en-GB', { weekday: 'short' })
  return `${day}, ${time}`
}

function getLaterToday() {
  const date = new Date()
  date.setHours(18, 0, 0, 0)
  if (date <= new Date()) {
    date.setDate(date.getDate() + 1)
    date.setHours(8, 0, 0, 0)
  }
  return date
}

function getTomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(8, 0, 0, 0)
  return date
}

function getNextWeek() {
  const date = new Date()
  const day = date.getDay()
  let daysToAdd = (8 - day) % 7
  if (daysToAdd === 0) daysToAdd = 7
  date.setDate(date.getDate() + daysToAdd)
  date.setHours(8, 0, 0, 0)
  return date
}

export default function ReminderPicker({ reminder, onSave, onClear, onClose }) {
  const [showCustom, setShowCustom] = useState(false)
  const [date, setDate] = useState(reminder?.date || '')
  const [time, setTime] = useState(reminder?.time || '09:00')

  const presets = useMemo(() => {
    const laterToday = getLaterToday()
    const tomorrow = getTomorrow()
    const nextWeek = getNextWeek()

    return [
      { id: 'later-today', label: 'Later today', date: laterToday },
      { id: 'tomorrow', label: 'Tomorrow', date: tomorrow },
      { id: 'next-week', label: 'Next week', date: nextWeek },
    ]
  }, [])

  const handlePreset = (presetDate) => {
    onSave(toReminderPayload(presetDate))
    onClose?.()
  }

  const handleCustomSave = () => {
    if (date) {
      onSave({ date, time })
      onClose?.()
    }
  }

  const handleClear = () => {
    onClear?.()
    onClose?.()
  }

  return (
    <div className="reminder-picker" onClick={(e) => e.stopPropagation()}>
      <h3 className="reminder-picker__title">Remind me later</h3>
      <p className="reminder-picker__subtitle">
        Your reminders are saved in Google Tasks
      </p>

      <ul className="reminder-picker__presets">
        {presets.map((preset) => (
          <li key={preset.id}>
            <button
              type="button"
              className="reminder-picker__option"
              onClick={() => handlePreset(preset.date)}
            >
              <span className="reminder-picker__option-label">{preset.label}</span>
              <span className="reminder-picker__option-time">
                {formatPresetTimeLabel(preset.date)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="reminder-picker__custom-trigger"
        onClick={() => setShowCustom((open) => !open)}
      >
        <span className="material-symbols-outlined">schedule</span>
        Select date and time
      </button>

      {showCustom && (
        <div className="reminder-picker__custom-panel">
          <label className="reminder-picker__field">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="reminder-picker__field">
            <span>Time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <div className="reminder-picker__custom-actions">
            <button type="button" onClick={handleCustomSave}>
              Save
            </button>
            {reminder && (
              <button
                type="button"
                className="reminder-picker__clear"
                onClick={handleClear}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
