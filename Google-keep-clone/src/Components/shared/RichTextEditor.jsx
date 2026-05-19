import { useEffect, useRef } from 'react'
import './RichTextEditor.css'

/**
 * Editable note body — stores HTML so bold/italic/lists from the toolbar work.
 */
export default function RichTextEditor({
  value,
  onChange,
  editorRef,
  placeholder = 'Take a note...',
  className = 'note-text-editor',
}) {
  const internalRef = useRef(null)
  const ref = editorRef || internalRef

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || ''
    }
  }, [value, ref])

  const handleInput = () => {
    onChange(ref.current?.innerHTML || '')
  }

  return (
    <div
      ref={ref}
      className={className}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onInput={handleInput}
      onClick={(e) => e.stopPropagation()}
    ></div>
  )
}
