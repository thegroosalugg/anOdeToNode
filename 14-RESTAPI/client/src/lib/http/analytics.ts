import { captainsLog } from "../util/captainsLog";

export async function postAnalytics() {
  const localData = localStorage.getItem("analytics");

  if (localData) {
    const savedData = JSON.parse(localData);
    const isLessThan24Hrs = Date.now() - new Date(savedData).getTime() < 24 * 60 * 60 * 1000;
    if (isLessThan24Hrs) return;
  }

  const { width, height } = window.screen;
  if (!width || !height) return;

  const date = new Date().toISOString();

  const headers = { ["Content-Type"]: "application/json", ["x-analytics"]: "true" };

  const body = JSON.stringify({
        date,
         url: location.href,
      screen: { width, height },
    userAgent: navigator.userAgent,
  });

  try {
    await fetch(import.meta.env.VITE_ANALYTICS_URL, { method: "POST", headers, body });
    localStorage.setItem("analytics", JSON.stringify(date));
  } catch (error) {
    captainsLog(0, { error });
  }
}
