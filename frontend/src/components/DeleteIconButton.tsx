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
      title={accessibleLabel}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 7h16M9 7V4h6v3m-9 0 1 13h8l1-13M10 11v5M14 11v5" />
      </svg>
    </button>
  );
}

export default DeleteIconButton;
