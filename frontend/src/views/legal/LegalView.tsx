import { Link } from "react-router-dom";

function LegalView() {
  return (
    <section className="legal-page" aria-labelledby="legal-title">
      <header className="legal-page__header">
        <p className="legal-page__eyebrow">WOD Explorer 2.0</p>
        <h1 id="legal-title">Aviso legal</h1>
        <p>
          Este texto es un borrador informativo para el proyecto WOD Explorer.
          No sustituye un aviso legal definitivo ni asesoramiento jurídico.
        </p>
      </header>

      <aside className="legal-page__notice" aria-labelledby="legal-status-title">
        <h2 id="legal-status-title">Pendiente de validación del titular</h2>
        <p>
          Antes de publicar una versión definitiva deben confirmarse los datos
          de identificación del titular y la naturaleza con la que se ofrece el
          sitio. No se han publicado esos datos como hechos en esta página.
        </p>
      </aside>

      <div className="legal-page__sections">
        <section className="legal-page__section">
          <h2>Objeto del sitio</h2>
          <p>
            WOD Explorer es una aplicación para consultar ejercicios y WODs,
            crear entrenamientos personales y registrar resultados. El código
            y la documentación del proyecto la describen como una herramienta
            personal de exploración y seguimiento de entrenamiento.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Información del titular</h2>
          <p>
            La identidad, el domicilio, el medio de contacto legal y, si
            corresponde, la identificación fiscal o registral del titular no
            han sido confirmados para este aviso. Deben validarse antes de
            presentar este texto como definitivo.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Uso del sitio</h2>
          <p>
            El acceso a las funcionalidades públicas y a las cuentas debe
            realizarse conforme a la normativa aplicable y sin intentar acceder
            a recursos de otros usuarios. Los WODs personales y los resultados
            se tratan como recursos privados de su propietario autenticado.
          </p>
        </section>

        <section className="legal-page__section">
          <h2>Marcas y contenidos de terceros</h2>
          <p>
            El proyecto emplea terminología de entrenamiento, como WOD y
            CrossFit, con finalidad descriptiva. No se ha identificado en el
            repositorio una afiliación, patrocinio o vinculación oficial con
            terceros; cualquier uso de marcas o contenidos requiere validación
            del titular antes de una publicación definitiva.
          </p>
        </section>
      </div>

      <section className="legal-page__scope" aria-labelledby="legal-scope-title">
        <h2 id="legal-scope-title">Alcance pendiente de confirmar</h2>
        <p>
          La LSSI-CE contempla deberes de información para los prestadores de
          servicios de la sociedad de la información que entren en su ámbito.
          La aplicación concreta depende, entre otros factores, de la actividad
          económica y de la situación del titular, que no constan confirmadas
          en el proyecto.
        </p>
        <ul>
          <li>Nombre o denominación del titular y datos de contacto efectivos.</li>
          <li>Domicilio, NIF, registro o autorización cuando resulten aplicables.</li>
          <li>Carácter personal, profesional o empresarial del proyecto.</li>
          <li>Monetización, precios, condiciones de contratación o publicidad, si existieran.</li>
          <li>Titularidad o licencias de contenidos, marcas y dominio.</li>
          <li>Hosting, jurisdicción y condiciones de publicación del servicio.</li>
        </ul>
      </section>

      <section className="legal-page__privacy" aria-labelledby="legal-privacy-title">
        <h2 id="legal-privacy-title">Protección de datos</h2>
        <p>
          El tratamiento técnico de datos personales se documenta por separado
          en la información de privacidad. Su contenido también permanece
          pendiente de la validación necesaria para convertirse en una política
          definitiva.
        </p>
        <Link to="/privacy">Consultar información de privacidad</Link>
      </section>

      <p className="legal-page__reviewed">
        Revisión técnica del borrador: 3 de noviembre de 2026.
      </p>
    </section>
  );
}

export default LegalView;
