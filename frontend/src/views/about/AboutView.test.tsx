import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AboutView from "./AboutView";

describe("AboutView", () => {
  it("describes the project and links only to existing author destinations", () => {
    const markup = renderToStaticMarkup(<AboutView />);

    expect(markup).toContain("Qué es WOD Explorer");
    expect(markup).toContain("Por qué nace");
    expect(markup).toContain("Qué ofrece hoy");
    expect(markup).toContain("Un proyecto en evolución");
    expect(markup).toContain('href="https://delforojas.es"');
    expect(markup).toContain('href="https://github.com/Delforojas"');
    expect(markup).not.toContain("Política de privacidad");
    expect(markup).not.toContain("Aviso legal");
  });
});
