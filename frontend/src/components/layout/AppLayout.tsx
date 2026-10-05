import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";
import Navbar from "./Navbar";
import PulsarGridBackground from "./PulsarGridBackground";

interface AppLayoutProps {
  children: ReactNode;
}

function getInitialSidebarCollapsed(): boolean {
  const stored = localStorage.getItem("sidebar-collapsed");
  return stored === "true";
}

function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialSidebarCollapsed);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "b") {
        event.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className={`app-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Navbar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <PulsarGridBackground />
        <div className="app-main-content">{children}</div>
      </main>
      <MobileNavigation isAuthenticated={Boolean(localStorage.getItem("token"))} onLogout={handleLogout} />
      <Footer />
    </div>
  );
}

export default AppLayout;