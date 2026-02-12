const storageKey = 'analytics';

async function postAnalytics() {
  const url = location.href;
  const { webdriver, userAgent } = navigator;
  const { width, height } = screen;
  if (webdriver || url.startsWith('http://') || !width || !height) return;

  const localData = localStorage.getItem(storageKey);
  if (localData) {
    const savedData = JSON.parse(localData);
    const isLessThan24Hrs = Date.now() - new Date(savedData).getTime() < 24 * 60 * 60 * 1000;
    if (isLessThan24Hrs) return;
  }

  const date = new Date().toISOString();
  const headers = { ['Content-Type']: 'application/json', ['x-analytics']: 'true' };
  const body = JSON.stringify({ date, url, screen: { width, height }, userAgent });

  try {
    await fetch(window.ANALYTICS_URL, { method: 'POST', headers, body });
    localStorage.setItem(storageKey, JSON.stringify(date));
  } catch (error) {
    console.log(error);
  }
}

postAnalytics(); // calls function when script is loaded
