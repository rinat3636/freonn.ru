/**
 * Яндекс.Метрика — вспомогательные функции для трекинга событий
 * Counter ID: 108466098
 */

declare global {
  interface Window {
    ym?: (counterId: number, action: string, goalName: string, params?: Record<string, unknown>) => void;
    gtag?: (...args: (string | Record<string, unknown> | Date)[]) => void;
    dataLayer?: (string | Record<string, unknown>)[];
  }
}

const COUNTER_ID = 108466098;

/**
 * Отправить цель в Яндекс.Метрику
 * @param goalName — идентификатор цели (например, "form_submit")
 * @param params — дополнительные параметры (необязательно)
 */
export function ymGoal(goalName: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.ym === "function") {
    window.ym(COUNTER_ID, "reachGoal", goalName, params);
  }
}

/**
 * Отправить событие в Google Analytics 4
 */
export function gaEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  }
}
