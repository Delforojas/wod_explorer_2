import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import LoginView from "./LoginView";

function renderLoginView(): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <LoginView
        username="Rogue"
        password="secret"
        onUsernameChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn()}
        onGoogleLogin={vi.fn()}
        error={null}
        isSubmitting={false}
        isSuccess={false}
      />
    </MemoryRouter>,
  );
}

describe("LoginView", () => {
  it("shows a disabled upcoming recovery control before the submit action", () => {
    const markup = renderLoginView();

    expect(markup).toContain("¿Olvidaste tu contraseña?");
    expect(markup).toContain("Próximamente");
    expect(markup).toMatch(
      /<button class="login-password-recovery" type="button" disabled="">/,
    );
    expect(markup.indexOf("¿Olvidaste tu contraseña?")).toBeGreaterThan(
      markup.indexOf('id="password"'),
    );
    expect(markup.indexOf("¿Olvidaste tu contraseña?")).toBeLessThan(
      markup.indexOf('class="login-submit"'),
    );
  });
});
