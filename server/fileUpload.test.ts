import fs from "fs";
import os from "os";
import path from "path";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Request, Response } from "express";

// Point uploads at a throwaway directory BEFORE localStorage is evaluated.
// localStorage/fileUpload are only loaded via dynamic import below, so this
// assignment is guaranteed to run first.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "freonn-uploads-"));
process.env.UPLOAD_DIR = tmpDir;

let resolveBaseUrl: typeof import("./fileUpload").resolveBaseUrl;
let handleUploadFile: typeof import("./fileUpload").handleUploadFile;
let uploadFileToLocal: typeof import("./localStorage").uploadFileToLocal;

const originalPublicUrl = process.env.APP_PUBLIC_URL;

beforeAll(async () => {
  ({ resolveBaseUrl, handleUploadFile } = await import("./fileUpload"));
  ({ uploadFileToLocal } = await import("./localStorage"));
});

beforeEach(() => {
  delete process.env.APP_PUBLIC_URL;
});

afterAll(() => {
  if (originalPublicUrl === undefined) delete process.env.APP_PUBLIC_URL;
  else process.env.APP_PUBLIC_URL = originalPublicUrl;
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

type MockFile = { buffer: Buffer; originalname: string; mimetype: string };

function createMockReq(opts: {
  file?: MockFile;
  headers?: Record<string, string>;
  protocol?: string;
}): Request {
  const headers = opts.headers ?? {};
  return {
    file: opts.file,
    headers,
    protocol: opts.protocol ?? "http",
    get(name: string): string | undefined {
      return headers[name.toLowerCase()];
    },
  } as unknown as Request;
}

function createMockRes(): {
  res: Response;
  captured: { statusCode: number; body: unknown };
} {
  const captured = { statusCode: 200, body: undefined as unknown };
  const res = {
    status(code: number) {
      captured.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      captured.body = payload;
      return res;
    },
  } as unknown as Response;
  return { res, captured };
}

describe("resolveBaseUrl", () => {
  it("prefers APP_PUBLIC_URL and strips trailing slashes", () => {
    process.env.APP_PUBLIC_URL = "https://freonn.ru/";
    const req = createMockReq({
      headers: { host: "other.test" },
      protocol: "http",
    });
    expect(resolveBaseUrl(req)).toBe("https://freonn.ru");
  });

  it("derives an absolute url from x-forwarded-proto and host", () => {
    const req = createMockReq({
      headers: { host: "freonn.ru", "x-forwarded-proto": "https" },
      protocol: "http",
    });
    expect(resolveBaseUrl(req)).toBe("https://freonn.ru");
  });

  it("falls back to req.protocol when no forwarded proto is present", () => {
    const req = createMockReq({
      headers: { host: "example.com:3000" },
      protocol: "http",
    });
    expect(resolveBaseUrl(req)).toBe("http://example.com:3000");
  });

  it("returns an empty string when host is unknown", () => {
    const req = createMockReq({ headers: {}, protocol: "https" });
    expect(resolveBaseUrl(req)).toBe("");
  });
});

describe("handleUploadFile", () => {
  it("returns 400 when no file is attached", async () => {
    const req = createMockReq({ headers: { host: "freonn.ru" } });
    const { res, captured } = createMockRes();
    await handleUploadFile(req, res);
    expect(captured.statusCode).toBe(400);
    expect(captured.body).toEqual({ success: false, error: "Файл не получен" });
  });

  it("stores the file and returns an absolute, viewable url", async () => {
    const content = Buffer.from("hello upload");
    const req = createMockReq({
      file: {
        buffer: content,
        originalname: "doc.pdf",
        mimetype: "application/pdf",
      },
      headers: { host: "freonn.ru", "x-forwarded-proto": "https" },
    });
    const { res, captured } = createMockRes();

    await handleUploadFile(req, res);

    expect(captured.statusCode).toBe(200);
    const body = captured.body as {
      success: boolean;
      url: string;
      filename: string;
    };
    expect(body.success).toBe(true);
    expect(body.filename).toBe("doc.pdf");
    expect(body.url).toMatch(
      /^https:\/\/freonn\.ru\/uploads\/\d+_[0-9a-f]{16}_doc\.pdf$/
    );

    const key = body.url.split("/uploads/")[1];
    const stored = fs.readFileSync(path.join(tmpDir, key));
    expect(stored.equals(content)).toBe(true);
  });
});

describe("uploadFileToLocal", () => {
  it("writes the buffer to the upload directory and returns its url", async () => {
    const content = Buffer.from("contract bytes");
    const url = await uploadFileToLocal(
      content,
      "Договор.pdf",
      "application/pdf",
      "https://freonn.ru"
    );

    expect(url).toMatch(
      /^https:\/\/freonn\.ru\/uploads\/\d+_[0-9a-f]{16}_+\.pdf$/
    );
    const key = url.split("/uploads/")[1];
    const stored = fs.readFileSync(path.join(tmpDir, key));
    expect(stored.equals(content)).toBe(true);
  });
});
