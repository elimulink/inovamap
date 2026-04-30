export function getAngle(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };

  const dot = ab.x * bc.x + ab.y * bc.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magBC = Math.sqrt(bc.x * bc.x + bc.y * bc.y);

  if (!magAB || !magBC) return 0;

  const cos = dot / (magAB * magBC);
  return Math.acos(Math.min(1, Math.max(-1, cos))) * (180 / Math.PI);
}

export function getTurnDirection(a, b, c) {
  const cross =
    (b.x - a.x) * (c.y - b.y) -
    (b.y - a.y) * (c.x - b.x);

  if (Math.abs(cross) < 0.001) return "straight";
  return cross > 0 ? "left" : "right";
}

export function generateInstructions(pathNodes, floor) {
  if (!pathNodes || pathNodes.length < 2) return [];

  const steps = [];
  let currentDistance = 0;

  for (let i = 0; i < pathNodes.length - 1; i++) {
    const a = pathNodes[i];
    const b = pathNodes[i + 1];

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) * floor.metersPerPixel * floor.imageWidthPixels / 100;

    currentDistance += dist;

    if (i < pathNodes.length - 2) {
      const c = pathNodes[i + 2];

      const angle = getAngle(a, b, c);
      const turn = getTurnDirection(a, b, c);

      if (angle > 25) {
        steps.push({
          type: turn,
          text: `Go ${Math.round(currentDistance)} meters then turn ${turn}`,
        });
        currentDistance = 0;
      }
    }
  }

  if (currentDistance > 0) {
    steps.push({
      type: "straight",
      text: `Continue ${Math.round(currentDistance)} meters`,
    });
  }

  steps.push({
    type: "arrive",
    text: "You have arrived at your destination",
  });

  return steps;
}
