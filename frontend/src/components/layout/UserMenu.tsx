import { useEffect, useId, useRef, useState } from "react";

export type UserMenuPlacement = "bottom";

interface UserMenuProps {
  username?: string | null;
  onLogout: () => void;
  placement: UserMenuPlacement;
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20c.8-3.1 3.1-4.7 6.5-4.7s5.7 1.6 6.5 4.7" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 5h5v14h-5" />
      <path d="M3 12h11m-4-4 4 4-4 4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function UserMenu({ username, onLogout, placement }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logoutRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      logoutRef.current?.focus();
    }
  }, [isOpen]);

  function handleLogout() {
    setIsOpen(false);
    onLogout();
  }

  return (
    <div className="user-menu" data-placement={placement} ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        className="user-menu-trigger"
        aria-label={username ? `Mi cuenta de ${username}` : "Mi cuenta"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="user-menu-avatar">
          <UserIcon />
        </span>
        <span className="user-menu-label">Mi cuenta</span>
        <span className="user-menu-chevron">
          <ChevronIcon />
        </span>
      </button>

      {isOpen ? (
        <div
          id={menuId}
          className="user-menu-panel"
          role="menu"
          aria-label="Opciones de cuenta"
        >
          <button
            ref={logoutRef}
            type="button"
            className="user-menu-logout"
            role="menuitem"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>Cerrar sesión</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default UserMenu;
