export function interpolate(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

export function buildRouteSegments(nodePath) {
  const segments = [];

  for (let i = 0; i < nodePath.length - 1; i++) {
    segments.push({
      from: nodePath[i],
      to: nodePath[i + 1],
      progress: 0,
    });
  }

  return segments;
}

export function getSegmentProgress(segment, speed = 0.01) {
  return Math.min(1, segment.progress + speed);
}
