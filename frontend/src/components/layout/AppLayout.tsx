import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";
import Navbar from "./Navbar";
import PulsarGridBackground from "./PulsarGridBackground";
import { useAuth } from "../../auth/useAuth";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, username, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
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

      <MobileNavigation
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={handleLogout}
      />

      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default AppLayout;
