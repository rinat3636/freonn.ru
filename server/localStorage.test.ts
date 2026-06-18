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

  it("replaces unsafe and non-latin characters with underscores", () => {
    expect(sanitizeUploadName("счёт.pdf")).toBe("____.pdf");
    expect(sanitizeUploadName("my file (1).docx")).toBe("my_file__1_.docx");
    expect(sanitizeUploadName("файл")).not.toMatch(/[^a-zA-Z0-9._-]/);
  });

  it("keeps latin letters, digits, dots, dashes and underscores", () => {
    expect(sanitizeUploadName("Report-2024_v1.2.pdf")).toBe(
      "Report-2024_v1.2.pdf"
    );
  });

  it("falls back to 'file' when nothing safe remains", () => {
    expect(sanitizeUploadName("/")).toBe("file");
  });
});

describe("buildUploadKey", () => {
  it("produces a timestamp_random_name key", () => {
    expect(buildUploadKey("doc.pdf")).toMatch(/^\d+_[0-9a-f]{16}_doc\.pdf$/);
  });

  it("applies filename sanitization inside the key", () => {
    expect(buildUploadKey("../secret report.pdf")).toMatch(
      /^\d+_[0-9a-f]{16}_secret_report\.pdf$/
    );
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
