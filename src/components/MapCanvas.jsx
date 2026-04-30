import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function MapCanvas({
  imageSrc,
  nodes,
  pois,
  routePoints,
  highlight,
  heightClassName = "h-[55vh] min-h-[360px]",
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [size, setSize] = useState({ w: 800, h: 500 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({
        w: Math.max(320, Math.floor(rect.width)),
        h: Math.max(320, Math.floor(rect.height)),
      });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const image = useMemo(() => {
    const img = new Image();
    img.src = imageSrc;
    return img;
  }, [imageSrc]);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.15, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.15, 0.6));
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.6), 3));
  };

  const handlePointerDown = (e) => {
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    offsetStartRef.current = { ...offset };
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffset({
      x: offsetStartRef.current.x + dx,
      y: offsetStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e) => {
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = size.w;
    const ch = size.h;
    canvas.width = cw;
    canvas.height = ch;

    ctx.clearRect(0, 0, cw, ch);

    const maxNodeX = Math.max(1000, ...nodes.map((n) => n.x + 120));
    const maxNodeY = Math.max(700, ...nodes.map((n) => n.y + 120));
    const imageReady = img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;

    const iw = imageReady ? img.naturalWidth : maxNodeX;
    const ih = imageReady ? img.naturalHeight : maxNodeY;

    const fitScale = Math.min(cw / iw, ch / ih);
    const drawScale = fitScale * scale;

    const dw = iw * drawScale;
    const dh = ih * drawScale;
    const dx = (cw - dw) / 2 + offset.x;
    const dy = (ch - dh) / 2 + offset.y;

    const toCanvas = (p) => ({
      x: dx + p.x * drawScale,
      y: dy + p.y * drawScale,
    });

    if (imageReady) {
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(dx, dy, dw, dh);
    }

    if (routePoints?.length >= 2) {
      ctx.save();
      ctx.lineWidth = Math.max(4, 6 * drawScale * 0.01);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      const first = toCanvas(routePoints[0]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < routePoints.length; i++) {
        const p = toCanvas(routePoints[i]);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      ctx.lineWidth = Math.max(3, 4.5 * drawScale * 0.01);
      ctx.strokeStyle = "rgba(34,197,94,0.95)";
      ctx.stroke();
      ctx.restore();
    }

    const startId = highlight?.startPoiId;
    const destId = highlight?.destPoiId;

    for (const poi of pois) {
      const nearNode = nodes.find((n) => n.id === poi.nearNodeId);
      if (!nearNode) continue;

      const p = toCanvas(nearNode);
      const isStart = poi.id === startId;
      const isDest = poi.id === destId;

      ctx.save();
      ctx.beginPath();
      const r = isStart || isDest ? 9 : 7;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);

      if (isStart) ctx.fillStyle = "rgba(59,130,246,0.95)";
      else if (isDest) ctx.fillStyle = "rgba(34,197,94,0.95)";
      else ctx.fillStyle = "rgba(255,255,255,0.92)";

      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(15,23,42,0.35)";
      ctx.stroke();
      ctx.restore();
    }
  }, [highlight, nodes, offset.x, offset.y, pois, routePoints, scale, size.h, size.w]);

  useEffect(() => {
    imgRef.current = image;
    const onLoad = () => draw();
    image.addEventListener("load", onLoad);
    return () => image.removeEventListener("load", onLoad);
  }, [draw, image]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative">
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <button
          onClick={zoomIn}
          className="rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
        >
          -
        </button>
        <button
          onClick={resetView}
          className="rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
        >
          Reset
        </button>
      </div>

      <div
        ref={wrapRef}
        className={`${heightClassName} w-full overflow-hidden rounded-2xl bg-slate-950`}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full touch-none"
          role="img"
          aria-label="Indoor map with route overlay"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    </div>
  );
}
