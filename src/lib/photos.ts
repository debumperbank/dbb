export async function validPhoto(photo: File) {
  if (photo.size === 0 || photo.size > 1048576) return false;
  const b = new Uint8Array(await photo.slice(0, 12).arrayBuffer());
  return (
    (photo.type === "image/jpeg" &&
      b[0] === 255 &&
      b[1] === 216 &&
      b[2] === 255) ||
    (photo.type === "image/png" &&
      [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => b[i] === v)) ||
    (photo.type === "image/webp" &&
      String.fromCharCode(...b.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...b.slice(8, 12)) === "WEBP")
  );
}
export const photoExtension = (photo: File) =>
  photo.type === "image/jpeg"
    ? "jpg"
    : photo.type === "image/png"
      ? "png"
      : "webp";
