import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

const GRID_SPACING = 36;
const MAX_DEVICE_PIXEL_RATIO = 2;

function hexToRgba(color: string, opacity: number) {
  const hex = color.replace("#", "");

  if (hex.length !== 6) {
    return color;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return `rgb(${red} ${green} ${blue} / ${opacity})`;
}

function PulsarGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;

    if (!canvas || !container) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const accent = getComputedStyle(container).getPropertyValue("--color-primary-500").trim();
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let isVisible = document.visibilityState === "visible";
    let time = 0;

    const isStatic = () => reducedMotion.matches || coarsePointer.matches;

    const draw = (animated: boolean) => {
      context.clearRect(0, 0, width, height);

      for (const point of points) {
        const distance = Math.hypot(point.x - mousePositionRef.current.x, point.y - mousePositionRef.current.y);
        const wave = animated ? Math.max(0, Math.sin(distance * 0.035 - time * 0.003)) : 0;
        const radius = 0.65 + wave * 1.35;
        const opacity = animated ? 0.035 + wave * 0.2 : 0.07;

        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fillStyle = hexToRgba(accent, opacity);
        context.fill();
      }
    };

    const stopAnimation = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const animate = () => {
      if (!isVisible || isStatic()) {
        animationFrame = 0;
        return;
      }

      time += 1;
      draw(true);
      animationFrame = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!animationFrame && isVisible && !isStatic()) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      points = [];

      for (let x = GRID_SPACING / 2; x < width; x += GRID_SPACING) {
        for (let y = GRID_SPACING / 2; y < height; y += GRID_SPACING) {
          points.push({ x, y });
        }
      }

      if (mousePositionRef.current.x === 0 && mousePositionRef.current.y === 0) {
        mousePositionRef.current = { x: width / 2, y: height / 2 };
      }

      draw(!isStatic());
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      mousePositionRef.current = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";

      if (isVisible) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    const handleMotionPreferenceChange = () => {
      stopAnimation();
      draw(!isStatic());
      startAnimation();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
    coarsePointer.addEventListener("change", handleMotionPreferenceChange);
    resize();
    startAnimation();

    return () => {
      stopAnimation();
      observer.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
      coarsePointer.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="pulsar-grid" aria-hidden="true" />;
}

export default PulsarGridBackground;
