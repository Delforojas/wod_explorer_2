interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      className={isOpen ? "mobile-menu-button is-open" : "mobile-menu-button"}
      aria-controls="mobile-navigation"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      onClick={onClick}
    >
      <span className="menu-icon" aria-hidden="true" />
    </button>
  );
}

export default MobileMenuButton;
