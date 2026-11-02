import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Footer from "../components/layout/Footer";

describe("footer social links", () => {
  it("preserves the social link destinations", () => {
    const markup = renderToStaticMarkup(<Footer isAuthenticated={false} />);

    expect(markup).toContain(
      'href="https://www.linkedin.com/in/delfinrojas/"',
    );
    expect(markup).toContain('href="https://github.com/Delforojas"');
    expect(markup).toContain('href="https://delforojas.es"');
    expect(markup).toContain('href="mailto:delfinrojasespina@email.com"');
  });
});
