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
                let targetCompleteURL = targetURL;
                switch(path.toLowerCase()) {
                    case "search":
                        targetCompleteURL = `${targetURL}/search?q=${params.get('q')||""}`;
                        break;
                    case "explore":
                        targetCompleteURL = targetURL;
                        break;
                    case "home":
                        targetCompleteURL = targetURL;
                        break;
                    case "settings":
                        targetCompleteURL = `${targetURL}/settings`;
                        break;
                    case "messages":
                        targetCompleteURL = `${targetURL}/messages`;
                        break;
                    case "notifications":
                        targetCompleteURL = `${targetURL}/notifications`;
                        break;
                    default:
                        if (/^[a-zA-Z0-9-_]+$/.test(path)) {
                            targetCompleteURL = `${targetURL}/search?q=${path}`;
                        } else {
                            targetCompleteURL = targetURL; // Default case if no match found
                        }
                }
                return { redirectUrl: targetCompleteURL };
            }
        }
    }
  },
  { urls: ["*://*/*"] },
  ["blocking"]
);