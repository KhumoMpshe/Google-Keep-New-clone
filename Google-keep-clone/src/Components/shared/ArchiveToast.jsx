import './ArchiveToast.css'

export default function ArchiveToast({ visible, onUndo }) {
  if (!visible) return null

  return (
    <div className="archive-toast" role="status">
      <span>Notes archived</span>
      <button type="button" onClick={onUndo}>
        Undo
      </button>
    </div>
  )
}
