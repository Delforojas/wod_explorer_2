import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

/* ==========================================
   CONFIGURACIÓN
========================================== */

const GRID_SPACING = 36;
const MAX_DEVICE_PIXEL_RATIO = 2;
const DEFAULT_PULSAR_COLOR = "#ff6b00";

/* ==========================================
   CONVERSIÓN HEX → RGBA
========================================== */

function hexToRgba(color: string, opacity: number): string {
  const hex = color.replace("#", "");

  if (hex.length !== 6) {
    return color;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

/* ==========================================
   PULSAR GRID BACKGROUND
========================================== */

function PulsarGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mousePositionRef = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;

    if (!canvas || !container) {
      return;
    }

    const context = canvas.getContext("2d", {
      alpha: true,
    });

    if (!context) {
      return;
    }

    /* ==========================================
       PREFERENCIAS DEL DISPOSITIVO
    ========================================== */

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const coarsePointer = window.matchMedia("(pointer: coarse)");

    /* ==========================================
       COLOR DEL GRID
    ========================================== */

    const accent =
      getComputedStyle(canvas).getPropertyValue("--pulsar-color").trim() ||
      DEFAULT_PULSAR_COLOR;

    /* ==========================================
       ESTADO INTERNO
    ========================================== */

    let points: Point[] = [];

    let width = 0;
    let height = 0;

    let animationFrame = 0;

    let isVisible = document.visibilityState === "visible";

    let time = 0;

    const isStatic = () => reducedMotion.matches || coarsePointer.matches;

    /* ==========================================
       DIBUJAR GRID
    ========================================== */

    const draw = (animated: boolean) => {
      context.clearRect(0, 0, width, height);

      for (const point of points) {
        const distance = Math.hypot(
          point.x - mousePositionRef.current.x,
          point.y - mousePositionRef.current.y,
        );

        const wave = animated
          ? Math.max(0, Math.sin(distance * 0.035 - time * 0.003))
          : 0;

        /*
         * Escritorio: animación original.
         * Móvil: puntos estáticos más visibles.
         */

        const radius = animated ? 0.65 + wave * 1.35 : 1.2;

        const opacity = animated ? 0.035 + wave * 0.2 : 0.25;

        context.beginPath();

        context.arc(point.x, point.y, radius, 0, Math.PI * 2);

        context.fillStyle = hexToRgba(accent, opacity);

        context.fill();
      }
    };

    /* ==========================================
       DETENER ANIMACIÓN
    ========================================== */

    const stopAnimation = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    /* ==========================================
       ANIMACIÓN
    ========================================== */

    const animate = () => {
      if (!isVisible || isStatic()) {
        animationFrame = 0;
        return;
      }

      time += 1;

      draw(true);

      animationFrame = requestAnimationFrame(animate);
    };

    /* ==========================================
       INICIAR ANIMACIÓN
    ========================================== */

    const startAnimation = () => {
      if (!animationFrame && isVisible && !isStatic()) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    /* ==========================================
       REDIMENSIONAR CANVAS
    ========================================== */

    const resize = () => {
      const bounds = container.getBoundingClientRect();

      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_DEVICE_PIXEL_RATIO,
      );

      /*
       * IMPORTANTE:
       *
       * El ancho corresponde al contenido principal.
       * La altura corresponde únicamente al viewport.
       *
       * No utilizamos bounds.height porque en
       * Ejercicios puede superar los 30.000 px.
       */

      const nextWidth = Math.max(1, bounds.width);
      const nextHeight = Math.max(1, window.innerHeight);

      /*
       * Mantener el Canvas alineado con .app-main.
       * En escritorio respeta el desplazamiento
       * provocado por la sidebar.
       */

      canvas.style.left = `${bounds.left}px`;
      canvas.style.width = `${nextWidth}px`;

      /*
       * Evitar recrear el buffer cuando solamente
       * cambia la altura total del contenido.
       */

      if (width === nextWidth && height === nextHeight) {
        return;
      }

      width = nextWidth;
      height = nextHeight;

      /* Resolución interna limitada */

      canvas.width = Math.round(width * pixelRatio);

      canvas.height = Math.round(height * pixelRatio);

      /* Coordenadas CSS */

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      /* ==========================================
         GENERAR PUNTOS
      ========================================== */

      points = [];

      for (let x = GRID_SPACING / 2; x < width; x += GRID_SPACING) {
        for (let y = GRID_SPACING / 2; y < height; y += GRID_SPACING) {
          points.push({
            x,
            y,
          });
        }
      }

      mousePositionRef.current = {
        x: width / 2,
        y: height / 2,
      };

      draw(!isStatic());
    };

    /* ==========================================
       SEGUIMIENTO DEL RATÓN
    ========================================== */

    const handlePointerMove = (event: PointerEvent) => {
      if (isStatic()) {
        return;
      }

      const bounds = canvas.getBoundingClientRect();

      mousePositionRef.current = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
    };

    /* ==========================================
       VISIBILIDAD DE LA PÁGINA
    ========================================== */

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";

      if (isVisible) {
        draw(!isStatic());
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    /* ==========================================
       CAMBIO DE PREFERENCIAS
    ========================================== */

    const handleMotionPreferenceChange = () => {
      stopAnimation();

      draw(!isStatic());

      startAnimation();
    };

    /* ==========================================
       OBSERVAR CAMBIOS DE TAMAÑO
    ========================================== */

    const observer = new ResizeObserver(resize);

    observer.observe(container);

    /* ==========================================
       EVENTOS
    ========================================== */

    window.addEventListener("resize", resize);

    container.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    reducedMotion.addEventListener("change", handleMotionPreferenceChange);

    coarsePointer.addEventListener("change", handleMotionPreferenceChange);

    /* ==========================================
       INICIALIZACIÓN
    ========================================== */

    resize();

    startAnimation();

    /* ==========================================
       LIMPIEZA
    ========================================== */

    return () => {
      stopAnimation();

      observer.disconnect();

      window.removeEventListener("resize", resize);

      container.removeEventListener("pointermove", handlePointerMove);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);

      coarsePointer.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="pulsar-grid" aria-hidden="true" />;
}

export default PulsarGridBackground;
