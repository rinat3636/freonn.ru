import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");

export function getUploadDir(): string {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  return UPLOAD_DIR;
}

export async function uploadFileToLocal(
  buffer: Buffer,
  originalName: string,
  _mimeType: string
): Promise<string> {
  const dir = getUploadDir();
  const sanitizedName = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${Date.now()}_${crypto.randomBytes(8).toString("hex")}_${sanitizedName}`;
  await fs.promises.writeFile(path.join(dir, key), buffer);

  const base = (process.env.APP_PUBLIC_URL || "").replace(/\/+$/, "");
  return `${base}/uploads/${key}`;
}
