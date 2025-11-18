const getAnalytics = async () => {
  try {
    if (navigator.webdriver) return;
    const last = localStorage.getItem("analytics");
    const now = Date.now();
    if (last && now - Number(last) < 24 * 60 * 60 * 1000) return;

    const data = {
        path: location.pathname,
          ua: navigator.userAgent,
      screen: { width: screen.width, height: screen.height },
    };

    await fetch("/analytics", {
       method: "POST",
      headers: { "Content-Type": "application/json" }, // tells server request is sending JSON
         body: JSON.stringify(data),
    });

    localStorage.setItem("analytics", String(now));
  } catch {}
};

getAnalytics(); // calls function when script is loaded
