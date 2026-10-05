import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";
import Navbar from "./Navbar";
import PulsarGridBackground from "./PulsarGridBackground";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <PulsarGridBackground />
        <div className="app-main-content">{children}</div>
      </main>
      <MobileNavigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Footer />
    </div>
  );
}

export default AppLayout;
