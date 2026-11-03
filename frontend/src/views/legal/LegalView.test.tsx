import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import LegalView from "./LegalView";

describe("LegalView", () => {
  it("identifies the text as a draft and separates pending holder details", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <LegalView />
      </MemoryRouter>,
    );

    expect(markup).toContain("Aviso legal");
    expect(markup).toContain("borrador informativo");
    expect(markup).toContain("Información del titular");
    expect(markup).toContain("Alcance pendiente de confirmar");
    expect(markup).toContain('href="/privacy"');
    expect(markup).not.toContain("Política de cookies");
  });
});
