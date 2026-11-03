import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyView from "./PrivacyView";

describe("PrivacyView", () => {
  it("labels the page as a draft and separates verified treatment from pending details", () => {
    const markup = renderToStaticMarkup(<PrivacyView />);

    expect(markup).toContain("Política de privacidad");
    expect(markup).toContain("borrador informativo");
    expect(markup).toContain("Datos identificados en la aplicación");
    expect(markup).toContain("Controles técnicos observados");
    expect(markup).toContain("Información que falta confirmar");
    expect(markup).toContain("Identidad, domicilio y contacto");
    expect(markup).not.toContain("Aviso legal");
  });
});
