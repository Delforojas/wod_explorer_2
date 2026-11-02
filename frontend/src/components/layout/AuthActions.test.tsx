import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AuthActions from "./AuthActions";

function renderAuthActions(
  isAuthenticated: boolean,
  username: string | null = null,
): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <AuthActions
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={() => undefined}
        placement="bottom"
      />
    </MemoryRouter>,
  );
}

describe("AuthActions", () => {
  it("keeps the login action for visitors without rendering the account menu", () => {
    const markup = renderAuthActions(false);

    expect(markup).toContain("Iniciar sesión");
    expect(markup).not.toContain("user-menu");
    expect(markup).not.toContain("Cerrar sesión");
  });

  it("renders the authenticated account trigger closed with an accessible name", () => {
    const markup = renderAuthActions(true, "Rogue");

    expect(markup).toContain('aria-label="Mi cuenta de Rogue"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toMatch(/aria-controls="[^"]+"/);
    expect(markup).toContain("Mi cuenta");
    expect(markup).toContain('data-placement="bottom"');
    expect(markup).not.toContain("Opciones de cuenta");
    expect(markup).not.toContain("Iniciar sesión");
  });
});
