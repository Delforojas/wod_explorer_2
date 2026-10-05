# Plan

Mantener la navegación móvil fija al borde inferior, con una grid de cinco columnas iguales y una única reserva inferior en el footer. Agrupar las acciones del formulario con clases semánticas existentes, sin cambiar handlers ni validación. Verificar lint, test, build y diff; las capturas quedan para validación manual.

La navegación fija crea una capa de apilamiento por encima del contenido de main para que el menú Más pueda desplegarse hacia arriba sin competir con los paneles internos; el menú continúa posicionado respecto a su propia columna y limita su altura al viewport.
