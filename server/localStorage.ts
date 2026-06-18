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

// Strip directory components and reduce the name to a URL-safe slug. Only
// [a-zA-Z0-9.-] survive; everything else (including underscores) becomes "-".
// This both prevents path traversal (e.g. "../../etc/passwd") and keeps the
// public link free of underscores, which MAX parses as markdown italics and
// uses to truncate the auto-linkified URL → a broken 404 link.
export function sanitizeUploadName(originalName: string): string {
  const base = path
    .basename(originalName)
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "file";
}

// Keys (and therefore public URLs) use "-" separators only, never "_", so the
// link stays intact when auto-linkified inside a MAX message.
export function buildUploadKey(originalName: string): string {
  return `${Date.now()}-${crypto.randomBytes(8).toString("hex")}-${sanitizeUploadName(originalName)}`;
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
