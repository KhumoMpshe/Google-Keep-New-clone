import { useEffect, useState } from 'react'
import './FormatToolbar.css'

const headingOptions = [
  { id: 'h1', label: 'H1', value: 'h1' },
  { id: 'h2', label: 'H2', value: 'h2' },
  { id: 'p', label: 'Aa', value: 'p' },
]

const styleOptions = [
  { id: 'bold', label: 'B', command: 'bold', className: 'format-toolbar__btn--bold' },
  { id: 'italic', label: 'I', command: 'italic', className: 'format-toolbar__btn--italic' },
  { id: 'underline', label: 'U', command: 'underline', className: 'format-toolbar__btn--underline' },
]

function getBlockFormat(editorEl) {
  const selection = window.getSelection()
  if (!selection?.rangeCount || !editorEl) return 'p'

  let node = selection.anchorNode
  if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement

  while (node && node !== editorEl) {
    const tag = node.tagName?.toLowerCase()
    if (tag === 'h1') return 'h1'
    if (tag === 'h2') return 'h2'
    if (tag === 'p' || tag === 'div') return 'p'
    node = node.parentElement
  }

  return 'p'
}

export default function FormatToolbar({ onFormat, editorRef }) {
  const [activeBlock, setActiveBlock] = useState('p')
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  })

  const syncToolbarState = () => {
    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    })
    setActiveBlock(getBlockFormat(editorRef?.current))
  }

  useEffect(() => {
    syncToolbarState()
    document.addEventListener('selectionchange', syncToolbarState)
    return () => document.removeEventListener('selectionchange', syncToolbarState)
  }, [editorRef])

  const handleBlockFormat = (value) => {
    onFormat('formatBlock', value)
    setActiveBlock(value)
    syncToolbarState()
  }

  const handleStyleFormat = (command) => {
    onFormat(command)
    syncToolbarState()
  }

  const handleClearFormat = () => {
    onFormat('removeFormat')
    setActiveBlock('p')
    syncToolbarState()
  }

  return (
    <div className="format-toolbar" onClick={(e) => e.stopPropagation()}>
      {headingOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`format-toolbar__btn format-toolbar__btn--heading${
            activeBlock === option.id ? ' format-toolbar__btn--active' : ''
          }`}
          title={option.label}
          onClick={() => handleBlockFormat(option.value)}
        >
          {option.label}
        </button>
      ))}

      <span className="format-toolbar__divider" aria-hidden="true" />

      {styleOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`format-toolbar__btn format-toolbar__btn--style ${option.className}${
            activeStyles[option.id] ? ' format-toolbar__btn--active' : ''
          }`}
          title={option.label}
          onClick={() => handleStyleFormat(option.command)}
        >
          {option.label}
        </button>
      ))}

      <button
        type="button"
        className="format-toolbar__btn format-toolbar__btn--clear"
        title="Clear formatting"
        onClick={handleClearFormat}
      >
        <span className="material-symbols-outlined">format_clear</span>
      </button>
    </div>
  )
}
