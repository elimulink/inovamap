export default function FloorImagePreview({ imageUrl, fileName }) {
  if (!imageUrl) {
    return (
      <div className="floor-image-empty">
        <strong>No floor image selected</strong>
        <span>Upload a PNG, JPG, or WEBP floor plan.</span>
      </div>
    );
  }

  return (
    <div className="floor-image-preview">
      <img src={imageUrl} alt={fileName || "Floor preview"} />
      {fileName ? <p>{fileName}</p> : null}
    </div>
  );
}
