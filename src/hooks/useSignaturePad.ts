import { useCallback, useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
}

const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** Canvas-based handwritten signature capture. Uses the Pointer Events API so mouse,
 * touch (finger) and pen input all go through one code path. Strokes are smoothed by
 * running a quadratic curve through the midpoints of each consecutive point triple
 * (the standard freehand-drawing technique) instead of raw straight segments, which
 * otherwise look faceted/jagged at normal drawing speed. No external dependency — a
 * signature is just strokes on a canvas exported as a PNG data URL. */
export function useSignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const isEmptyRef = useRef(true);
  const [isEmpty, setIsEmptyState] = useState(true);

  const setEmpty = (value: boolean) => {
    isEmptyRef.current = value;
    setIsEmptyState(value);
  };

  const getContext = useCallback(() => canvasRef.current?.getContext("2d") ?? null, []);

  const resizeCanvasToDisplaySize = useCallback(() => {
    // Resizing a <canvas> clears its pixels — never do it while a signature is on the
    // pad (e.g. the on-screen keyboard opening resizes the viewport mid-signature).
    if (!isEmptyRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width, 1) * dpr;
    const height = Math.max(rect.height, 1) * dpr;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      const ctx = getContext();
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#111827";
      }
    }
  }, [getContext]);

  useEffect(() => {
    resizeCanvasToDisplaySize();
    window.addEventListener("resize", resizeCanvasToDisplaySize);
    return () => window.removeEventListener("resize", resizeCanvasToDisplaySize);
  }, [resizeCanvasToDisplaySize]);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    pointsRef.current = [getPoint(e)];
    setEmpty(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      const ctx = getContext();
      if (!ctx) return;

      pointsRef.current.push(getPoint(e));
      if (pointsRef.current.length > 3) pointsRef.current.shift();
      const points = pointsRef.current;

      ctx.beginPath();
      if (points.length === 3) {
        const [p0, p1, p2] = points;
        const start = midpoint(p0, p1);
        const end = midpoint(p1, p2);
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(p1.x, p1.y, end.x, end.y);
      } else {
        const [p0, p1] = points;
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
      }
      ctx.stroke();
    },
    [getContext]
  );

  const handlePointerUp = useCallback(() => {
    drawingRef.current = false;
    pointsRef.current = [];
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setEmpty(true);
  }, [getContext]);

  const toDataUrl = useCallback((): string | null => {
    if (isEmptyRef.current || !canvasRef.current) return null;
    return canvasRef.current.toDataURL("image/png");
  }, []);

  return {
    canvasRef,
    isEmpty,
    clear,
    toDataUrl,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
    },
  };
}
