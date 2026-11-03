function PrivacyView() {
  return (
    <section className="privacy-page" aria-labelledby="privacy-title">
      <header className="privacy-page__header">
        <p className="privacy-page__eyebrow">WOD Explorer 2.0</p>
        <h1 id="privacy-title">Política de privacidad</h1>
        <p>
          Esta página reúne el tratamiento de datos identificado en el código
          de WOD Explorer. Es un borrador informativo y no una política
          definitiva hasta que el responsable valide la información pendiente.
        </p>
      </header>

      <aside className="privacy-page__notice" aria-labelledby="privacy-review-title">
        <h2 id="privacy-review-title">Pendiente de validación</h2>
        <p>
          Antes de publicar una política definitiva deben confirmarse la
          identidad y el contacto del responsable, los proveedores de
          infraestructura, los plazos de conservación y el canal para ejercer
          derechos de protección de datos.
        </p>
      </aside>

      <div className="privacy-page__sections">
        <section className="privacy-page__section">
          <h2>Datos identificados en la aplicación</h2>
          <p>
            El registro local solicita nombre de usuario, correo electrónico y
            contraseña. La aplicación conserva un hash de la contraseña, no la
            contraseña en texto plano.
          </p>
          <p>
            Si se usa el acceso con Google, la configuración solicita OpenID,
            perfil y correo. El código utiliza el correo verificado y el
            identificador de usuario del proveedor para vincular la cuenta.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Actividad de entrenamiento</h2>
          <p>
            Las cuentas pueden crear WODs personales y registrar resultados de
            entrenamiento, como fecha de realización, repeticiones, carga,
            distancia, duración, tiempos, rondas y estado de finalización.
          </p>
          <p>
            El modelo de la aplicación trata los WODs personales y los
            resultados como recursos privados del usuario autenticado.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Sesión y almacenamiento técnico</h2>
          <p>
            Tras iniciar sesión, el frontend guarda un token de sesión JWT en
            el almacenamiento local del navegador y lo envía en las solicitudes
            autenticadas.
          </p>
          <p>
            El acceso con Google emplea un intercambio temporal vinculado a la
            sesión del navegador. La configuración exacta de cookies y de
            infraestructura en producción debe confirmarse antes de publicarla
            como información definitiva.
          </p>
        </section>

        <section className="privacy-page__section">
          <h2>Controles técnicos observados</h2>
          <p>
            El backend expone operaciones autenticadas para actualizar una
            cuenta propia y eliminar resultados propios. También incluye una
            ruta para eliminar una cuenta, pero su efecto cuando existen WODs
            o resultados asociados requiere validación adicional.
          </p>
          <p>
            Estos controles técnicos no sustituyen un procedimiento formal para
            atender derechos de protección de datos.
          </p>
        </section>
      </div>

      <section className="privacy-page__pending" aria-labelledby="privacy-pending-title">
        <h2 id="privacy-pending-title">Información que falta confirmar</h2>
        <ul>
          <li>Identidad, domicilio y contacto del responsable del tratamiento.</li>
          <li>Base jurídica de cada finalidad y, si procede, consentimiento.</li>
          <li>Hosting, copias de seguridad, registros técnicos y encargados.</li>
          <li>Transferencias internacionales y garantías aplicables.</li>
          <li>Plazos o criterios de conservación y eliminación.</li>
          <li>Canal y procedimiento para ejercer derechos.</li>
          <li>Cookies efectivas y servicios activos en el despliegue público.</li>
        </ul>
      </section>

      <p className="privacy-page__reviewed">
        Última revisión técnica del borrador: 3 de noviembre de 2026.
      </p>
    </section>
  );
}

export default PrivacyView;
