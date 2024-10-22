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
            let result = await browser.storage.local.get('redirect')
            if ((params.get("no-redirect") && params.get("no-redirect").toLowerCase() == "true") || result.redirect == false) {
                return {};
            } else {
                let path = parsedUrl.pathname.split("/")[1];
                let targetCompleteURL = targetURL;
                switch(path.toLowerCase()) {
                    case "search":
                        targetCompleteURL = `${targetURL}/search?q=${params.get("q")||""}`;
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

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getRedirect") {
        browser.storage.local.get("redirect").then((result) => {
            sendResponse({ redirect: result.redirect });
        }).catch((error) => {
            console.error("Error retrieving redirect state:", error);
            sendResponse({ redirect: true });
        });
        return true;
    } else if (request.action === "setRedirect") {
        browser.storage.local.set({ redirect: request.redirect }).then(() => {
            sendResponse({ success: true });
        }).catch((error) => {
            console.error("Error saving redirect state:", error);
            sendResponse({ success: false });
        });
        return true;
    }
});