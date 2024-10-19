const targetURL = "https://bsky.app/";
const twitterRegex = /https?:\/\/(x|twitter)\.com/;

chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    console.log(details);
    if (details.type === "main_frame") {
      const currentUrl = details.url;
      if ((!details.originUrl || !twitterRegex.test(details.originUrl)) && twitterRegex.test(currentUrl)) {
        const parsedUrl = new URL(currentUrl);
        const params = new URLSearchParams(parsedUrl.search);
        if (params.get('no-redirect') === 'true') {
          return { cancel: true };
        } else {
          return { redirectUrl: targetURL };
        }
      }
    }
  },
  { urls: ["*://*/*"] },
  ["blocking"]
);
