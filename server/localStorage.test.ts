import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildPublicFileUrl,
  buildUploadKey,
  sanitizeUploadName,
} from "./localStorage";

describe("sanitizeUploadName", () => {
  it("strips directory components to prevent path traversal", () => {
    expect(sanitizeUploadName("../../etc/passwd")).toBe("passwd");
    expect(sanitizeUploadName("/var/www/secret.pdf")).toBe("secret.pdf");
    expect(sanitizeUploadName("nested/dir/report.xlsx")).toBe("report.xlsx");
  });

  it("replaces unsafe and non-latin characters with dashes", () => {
    expect(sanitizeUploadName("счёт.pdf")).toBe(".pdf");
    expect(sanitizeUploadName("my file (1).docx")).toBe("my-file-1-.docx");
    expect(sanitizeUploadName("файл")).toBe("file");
  });

  it("never produces underscores (they break MAX auto-links)", () => {
    expect(sanitizeUploadName("photo_2026-06-17.jpg")).toBe(
      "photo-2026-06-17.jpg"
    );
    expect(sanitizeUploadName("a_b_c.txt")).not.toMatch(/_/);
  });

  it("keeps latin letters, digits, dots and dashes (underscores become dashes)", () => {
    expect(sanitizeUploadName("Report-2024_v1.2.pdf")).toBe(
      "Report-2024-v1.2.pdf"
    );
  });

  it("falls back to 'file' when nothing safe remains", () => {
    expect(sanitizeUploadName("/")).toBe("file");
  });
});

describe("buildUploadKey", () => {
  it("produces a timestamp-random-name key with dash separators", () => {
    expect(buildUploadKey("doc.pdf")).toMatch(/^\d+-[0-9a-f]{16}-doc\.pdf$/);
  });

  it("applies filename sanitization inside the key", () => {
    expect(buildUploadKey("../secret report.pdf")).toMatch(
      /^\d+-[0-9a-f]{16}-secret-report\.pdf$/
    );
  });

  it("never contains an underscore", () => {
    expect(buildUploadKey("my_report v2.pdf")).not.toMatch(/_/);
  });

  it("generates a unique key on every call", () => {
    expect(buildUploadKey("doc.pdf")).not.toBe(buildUploadKey("doc.pdf"));
  });
});

describe("buildPublicFileUrl", () => {
  const original = process.env.APP_PUBLIC_URL;
  beforeEach(() => {
    delete process.env.APP_PUBLIC_URL;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.APP_PUBLIC_URL;
    else process.env.APP_PUBLIC_URL = original;
  });

  it("joins an absolute base with the uploads path", () => {
    expect(buildPublicFileUrl("abc_file.pdf", "https://freonn.ru")).toBe(
      "https://freonn.ru/uploads/abc_file.pdf"
    );
  });

  it("strips trailing slashes from the base", () => {
    expect(buildPublicFileUrl("abc_file.pdf", "https://freonn.ru///")).toBe(
      "https://freonn.ru/uploads/abc_file.pdf"
    );
  });

  it("falls back to APP_PUBLIC_URL when no base is passed", () => {
    process.env.APP_PUBLIC_URL = "https://env.example";
    expect(buildPublicFileUrl("abc_file.pdf")).toBe(
      "https://env.example/uploads/abc_file.pdf"
    );
  });

  it("returns a relative url when neither base nor env is set", () => {
    expect(buildPublicFileUrl("abc_file.pdf")).toBe("/uploads/abc_file.pdf");
  });
});
