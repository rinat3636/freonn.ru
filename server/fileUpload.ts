import type { Request, Response } from "express";
import { uploadFileToLocal } from "./localStorage";

// Resolves the absolute base URL used to build public file links.
// Prefers APP_PUBLIC_URL; otherwise derives it from the incoming request so the
// returned link is always absolute (and therefore openable from a MAX message),
// honouring X-Forwarded-Proto when behind a reverse proxy (nginx on the VPS).
export function resolveBaseUrl(req: Request): string {
  const configured = (process.env.APP_PUBLIC_URL || "").replace(/\/+$/, "");
  if (configured) return configured;

  const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const proto = forwardedProto || req.protocol || "http";
  const host = req.get("host");
  return host ? `${proto}://${host}` : "";
}

// Handles POST /api/upload-file. Expects multer to have populated req.file.
export async function handleUploadFile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "Файл не получен" });
      return;
    }
    const url = await uploadFileToLocal(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      resolveBaseUrl(req)
    );
    res.json({ success: true, url, filename: req.file.originalname });
  } catch (e) {
    console.error("[upload-file] Error:", e);
    res.status(500).json({ success: false, error: "Ошибка загрузки файла" });
  }
}
