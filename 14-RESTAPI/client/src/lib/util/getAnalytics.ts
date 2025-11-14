export function getAnalytics() {
  if (navigator.webdriver) return;

  const localData = localStorage.getItem("analytics");
  if (localData) {
    const savedData = JSON.parse(localData);
    const isLessThan24Hrs =
      Date.now() - new Date(savedData.ts).getTime() < 24 * 60 * 60 * 1000;
    if (isLessThan24Hrs) return;
  }

  const analytics = {
        ts: new Date().toISOString(),
      path: location.pathname,
        ua: navigator.userAgent,
    screen: { width: screen.width, height: screen.height },
  };

  localStorage.setItem("analytics", JSON.stringify(analytics));
  return analytics;
}
