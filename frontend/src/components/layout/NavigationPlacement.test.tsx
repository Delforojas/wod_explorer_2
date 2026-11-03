import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MobileNavigation from "./MobileNavigation";
import Navbar from "./Navbar";

const authState = vi.hoisted(() => ({
  isAuthenticated: true,
  username: "Rogue" as string | null,
  signOut: vi.fn(),
}));

vi.mock("../../auth/useAuth", () => ({
  useAuth: () => authState,
}));

function renderNavigation(element: React.ReactElement, pathname = "/"): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[pathname]}>{element}</MemoryRouter>,
  );
}

function getLinkMarkup(markup: string, href: string): string {
  const match = markup.match(new RegExp(`<a(?=[^>]*href="${href}")[^>]*>`));

  if (!match) {
    throw new Error(`No se encontró el enlace ${href}.`);
  }

  return match[0];
}

describe("navigation user menu placement", () => {
  beforeEach(() => {
    authState.isAuthenticated = true;
    authState.username = "Rogue";
  });

  it("uses bottom placement for the upper navbar and desktop sidebar", () => {
    const markup = renderNavigation(<Navbar />);

    expect(markup).toContain('class="auth-actions desktop-auth-actions"');
    expect(markup).toContain('data-placement="bottom"');
  });

  it("keeps the lower mobile navigation dock free of account actions", () => {
    const markup = renderNavigation(
      <MobileNavigation isAuthenticated />,
    );

    expect(markup).not.toContain("mobile-auth-actions");
    expect(markup).not.toContain("user-menu");
    expect(markup).not.toContain("Cerrar sesión");
  });

  it("keeps login visible in the responsive navbar for guests", () => {
    authState.isAuthenticated = false;
    authState.username = null;

    const markup = renderNavigation(<Navbar />);

    expect(markup).toContain("Iniciar sesión");
    expect(markup).not.toContain("user-menu");
  });

  it("labels the exercise results navigation as Benchmarks", () => {
    const desktopMarkup = renderNavigation(<Navbar />);
    const mobileMarkup = renderNavigation(<MobileNavigation isAuthenticated />);

    expect(desktopMarkup).toContain('href="/my-exercise-results"');
    expect(desktopMarkup).toContain(">Benchmarks</span>");
    expect(mobileMarkup).toContain('href="/my-exercise-results"');
    expect(mobileMarkup).toContain(">Benchmarks</span>");
  });

  it("shows the four public destinations for guests and omits private destinations", () => {
    const markup = renderNavigation(<MobileNavigation isAuthenticated={false} />);

    expect(markup.match(/class="mobile-dock-item"/g)).toHaveLength(4);
    expect(markup.indexOf('href="/"')).toBeLessThan(
      markup.indexOf('href="/exercises"'),
    );
    expect(markup).toContain('aria-label="Inicio"');
    expect(markup).toContain('href="/wods"');
    expect(markup).toContain('href="/login"');
    expect(markup).toContain('aria-label="Entrar"');
    expect(markup).not.toContain('href="/my-wods"');
    expect(markup).not.toContain('href="/history"');
  });

  it("marks Entrar active on the login route for guests", () => {
    const markup = renderNavigation(
      <MobileNavigation isAuthenticated={false} />,
      "/login",
    );

    expect(getLinkMarkup(markup, "/login")).toContain("nav-link-active");
  });

  it("shows the six requested primary destinations after authentication", () => {
    const markup = renderNavigation(<MobileNavigation isAuthenticated />);

    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/exercises"');
    expect(markup).toContain('href="/wods"');
    expect(markup).toContain('href="/my-wods"');
    expect(markup).toContain('href="/my-exercise-results"');
    expect(markup).toContain('href="/history"');
    expect(markup).not.toContain('href="/login"');
  });

  it("marks Inicio active only for the exact root pathname", () => {
    const rootMarkup = renderNavigation(<MobileNavigation isAuthenticated />, "/");
    const exercisesMarkup = renderNavigation(
      <MobileNavigation isAuthenticated />,
      "/exercises",
    );

    expect(getLinkMarkup(rootMarkup, "/")).toContain("nav-link-active");
    expect(getLinkMarkup(exercisesMarkup, "/")).not.toContain(
      "nav-link-active",
    );
  });

  it("keeps Inicio first in the desktop sidebar", () => {
    const markup = renderNavigation(<Navbar />);

    expect(markup.indexOf('href="/"')).toBeLessThan(
      markup.indexOf('href="/exercises"'),
    );
  });
});
