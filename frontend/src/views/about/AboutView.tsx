function AboutView() {
  return (
    <section className="about-page" aria-labelledby="about-title">
      <header className="about-page__header">
        <p className="about-page__eyebrow">WOD Explorer 2.0</p>
        <h1 id="about-title">Entrenar también es entender tu evolución.</h1>
        <p>
          WOD Explorer reúne ejercicios, entrenamientos y resultados en un
          mismo lugar para que puedas volver a tu actividad con más contexto.
        </p>
      </header>

      <div className="about-page__sections">
        <section className="about-page__section">
          <h2>Qué es WOD Explorer</h2>
          <p>
            Una aplicación para explorar ejercicios y WODs, registrar
            resultados y consultar la evolución de tu entrenamiento.
          </p>
        </section>

        <section className="about-page__section">
          <h2>Por qué nace</h2>
          <p>
            Nace de unir la práctica deportiva con el aprendizaje y desarrollo
            de software: un proyecto personal para construir una herramienta
            útil, clara y en mejora continua.
          </p>
        </section>

        <section className="about-page__section">
          <h2>Qué ofrece hoy</h2>
          <ul>
            <li>Catálogo público de ejercicios y WODs.</li>
            <li>Creación y consulta de WODs personales con sesión iniciada.</li>
            <li>Registro de resultados, historial y mejores marcas.</li>
          </ul>
        </section>

        <section className="about-page__section">
          <h2>Un proyecto en evolución</h2>
          <p>
            WOD Explorer se desarrolla de forma iterativa. Las mejoras futuras
            se incorporarán cuando estén definidas y disponibles, sin
            presentarlas como funciones actuales.
          </p>
        </section>
      </div>

      <aside className="about-page__author" aria-label="Autor del proyecto">
        <p className="about-page__eyebrow">Desarrollado por Delfo</p>
        <p>
          Un proyecto personal construido con atención al entrenamiento y al
          oficio de crear software.
        </p>
        <div className="about-page__author-links">
          <a href="https://delforojas.es" target="_blank" rel="noreferrer">
            Portfolio
          </a>
          <a
            href="https://github.com/Delforojas"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </aside>
    </section>
  );
}

export default AboutView;
