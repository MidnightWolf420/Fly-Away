const targetURL = "https://bsky.app";
const twitterRegex = /https?:\/\/(x|twitter)\.com(\/)?/;
const twitterSubdomainRegex = /https?:\/\/([a-z0-9]\.)?(x|twitter)\.com(\/)?/;
const pages = ["home", "search", "explore", "settings", "messages", "notifications"];

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if(details.type == "main_frame") {
        const currentUrl = details.url;
        if ((!details.originUrl || !twitterRegex.test(details.originUrl)) && (twitterRegex.test(currentUrl) || twitterSubdomainRegex.test(currentUrl))) {
            const parsedUrl = new URL(currentUrl);
            const params = new URLSearchParams(parsedUrl.search);
            if (params.get('no-redirect')) {
                console.log("No redirect")
                return {};
            } else {
                let path = parsedUrl.pathname.split('/')[1];
                if(/https?:\/\/(x|twitter)\.com\/[a-zA-Z0-9-_]+$/i && !new RegExp(`(${pages.join("|")})`, "i").test(path)) {
                    return { redirectUrl: `${targetURL}/search?q=${path}` };
                } else if(/https?:\/\/(x|twitter)\.com\/search(\/)?\?q=/i) {
                    return { redirectUrl: `${targetURL}/search?q=${params.get('q')||""}` };
                } else if(/https?:\/\/(x|twitter)\.com\/settings/i) {
                    return { redirectUrl: `${targetURL}/settings` };
                } else if(/https?:\/\/(x|twitter)\.com\/messages/i) {
                    return { redirectUrl: `${targetURL}/messages` };
                } else if(/https?:\/\/(x|twitter)\.com\/notifications/i) {
                    return { redirectUrl: `${targetURL}/notifications` };
                } else return { redirectUrl: targetURL };
            }
        }
    }
  },
  { urls: ["*://*/*"] },
  ["blocking"]
);