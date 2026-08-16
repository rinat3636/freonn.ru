import { ymGoal, gaEvent } from "./ym";

export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  let result = "";
  if (d.length > 0) result += "(" + d.slice(0, 3);
  if (d.length >= 3) result += ") " + d.slice(3, 6);
  if (d.length >= 6) result += "-" + d.slice(6, 8);
  if (d.length >= 8) result += "-" + d.slice(8, 10);
  return result;
}

export interface LeadBody {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  fileUrl?: string;
  fileName?: string;
  pageUrl: string;
  referrer?: string;
}

export async function submitLead(body: LeadBody): Promise<boolean> {
  // Track conversion at the moment of user intent, not after server response.
  ymGoal("form_submit", { service: body.service || "Не указано" });
  gaEvent("generate_lead", { service: body.service || "Не указано", page_path: body.pageUrl });

  try {
    const res = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}
