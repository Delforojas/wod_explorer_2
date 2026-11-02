import type { ReactNode } from "react";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";
import Navbar from "./Navbar";
import PulsarGridBackground from "./PulsarGridBackground";
import ScrollToTopButton from "./ScrollToTopButton";
import { useAuth } from "../../auth/useAuth";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();

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

      <ScrollToTopButton />

      <MobileNavigation isAuthenticated={isAuthenticated} />

      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default AppLayout;
