async function postAnalytics() {
  if (navigator.webdriver) return;
  const localData = localStorage.getItem('analytics');

  if (localData) {
    const savedData = JSON.parse(localData);
    const isLessThan24Hrs = Date.now() - new Date(savedData).getTime() < 24 * 60 * 60 * 1000;
    if (isLessThan24Hrs) return;
  }

  const { width, height } = window.screen;
  if (!width || !height) return;

  const date = new Date().toISOString();
  const body = JSON.stringify({
         date,
          url: location.href,
       screen: { width, height },
    userAgent: navigator.userAgent,
  });

  const headers = {
    ['Content-Type']: 'application/json',
     ['x-analytics']: 'true',
  };

  try {
    await fetch(window.ANALYTICS_URL, { method: 'POST', headers, body });

    localStorage.setItem('analytics', JSON.stringify(date));
  } catch (error) {
    console.log(error);
  }
}

postAnalytics(); // calls function when script is loaded
