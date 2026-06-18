import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.resolve(
  process.cwd(),
  process.env.UPLOAD_DIR || "uploads"
);

export function getUploadDir(): string {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  return UPLOAD_DIR;
}

// Strip directory components and unsafe characters so a malicious filename
// (e.g. "../../etc/passwd") can never escape the upload directory.
export function sanitizeUploadName(originalName: string): string {
  const base = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base || "file";
}

export function buildUploadKey(originalName: string): string {
  return `${Date.now()}_${crypto.randomBytes(8).toString("hex")}_${sanitizeUploadName(originalName)}`;
}

// Builds the public URL for a stored file. Falls back to APP_PUBLIC_URL when no
// base is provided. An absolute base is required for the link to be openable
// outside the site (e.g. inside a MAX notification).
export function buildPublicFileUrl(key: string, baseUrl?: string): string {
  const base = (baseUrl ?? process.env.APP_PUBLIC_URL ?? "").replace(
    /\/+$/,
    ""
  );
  return `${base}/uploads/${key}`;
}

export async function uploadFileToLocal(
  buffer: Buffer,
  originalName: string,
  _mimeType: string,
  baseUrl?: string
): Promise<string> {
  const dir = getUploadDir();
  const key = buildUploadKey(originalName);
  await fs.promises.writeFile(path.join(dir, key), buffer);
  return buildPublicFileUrl(key, baseUrl);
}
