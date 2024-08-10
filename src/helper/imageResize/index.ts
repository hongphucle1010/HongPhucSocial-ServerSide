import sharp from "sharp";

export async function imageResize(
  buffer: Buffer,
  width: number,
  height: number
) {
  return sharp(buffer).resize(width, height).toBuffer();
}
