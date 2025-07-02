export const trackPageView = (path) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, params);
  }
};
