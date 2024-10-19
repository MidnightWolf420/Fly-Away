const targetURL = "https://bsky.app/";
const twitterRegex = /https?:\/\/(x|twitter)\.com/;

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if(details.type == "main_frame") {
        const currentUrl = details.url;
        if ((!details.originUrl || !twitterRegex.test(details.originUrl)) && twitterRegex.test(currentUrl)) {
            const parsedUrl = new URL(currentUrl);
            const params = new URLSearchParams(parsedUrl.search);
            if (params.get('no-redirect') || params.get('no-redirect') === 'true') {
                return {};
            } else {
                return { redirectUrl: targetURL };
            }
        }
    }
  },
  { urls: ["*://*/*"] },
  ["blocking"]
);