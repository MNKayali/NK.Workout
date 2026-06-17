// Sticky bottom strip: current exercise + sets done + Save button.
export default function StickyFooter({ currentName, done, total, onSave, saveLabel = 'Finish & Save' }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/95 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{currentName}</div>
          <div className="text-xs text-ink-soft">{done}/{total} sets done</div>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="shrink-0 rounded-full bg-blue px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-pop)] active:scale-95 transition"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}
