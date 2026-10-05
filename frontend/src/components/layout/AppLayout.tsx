import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PulsarGridBackground from "./PulsarGridBackground";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
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
      <Footer />
    </div>
  );
}

export default AppLayout;
