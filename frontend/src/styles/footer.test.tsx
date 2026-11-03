import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "../components/layout/Footer";

function renderFooter() {
  return renderToStaticMarkup(
    <MemoryRouter>
      <Footer isAuthenticated={false} />
    </MemoryRouter>,
  );
}

describe("footer social links", () => {
  it("preserves the social link destinations", () => {
    const markup = renderFooter();

    expect(markup).toContain(
      'href="https://www.linkedin.com/in/delfinrojas/"',
    );
    expect(markup).toContain('href="https://github.com/Delforojas"');
    expect(markup).toContain('href="https://delforojas.es"');
    expect(markup).toContain('href="mailto:delfinrojasespina@email.com"');
  });

  it("links to the public information pages without rendering unrelated legal placeholders", () => {
    const markup = renderFooter();

    expect(markup).toContain('href="/about"');
    expect(markup).toContain("Sobre WOD Explorer");
    expect(markup).toContain('href="/privacy"');
    expect(markup).toContain("Privacidad");
    expect(markup).toContain('href="/legal"');
    expect(markup).toContain("Aviso legal");
    expect(markup).not.toContain("Política de cookies");
  });
});
