interface DeleteIconButtonProps {
  label: string;
  deleting: boolean;
  onClick: () => void;
}

function DeleteIconButton({ label, deleting, onClick }: DeleteIconButtonProps) {
  const accessibleLabel = deleting ? "Eliminando..." : label;

  return (
    <button
      type="button"
      className="delete-icon-button"
      disabled={deleting}
      aria-label={accessibleLabel}
      aria-busy={deleting}
      data-variant="destructive"
      data-size="icon"
      title={accessibleLabel}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    </button>
  );
}

export default DeleteIconButton;
