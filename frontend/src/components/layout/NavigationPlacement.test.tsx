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

function renderNavigation(element: React.ReactElement): string {
  return renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>);
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
});
