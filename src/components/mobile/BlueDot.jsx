export default function BlueDot({ position }) {
  if (!position) return null;

  return (
    <div
      className="blue-dot"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    />
  );
}
