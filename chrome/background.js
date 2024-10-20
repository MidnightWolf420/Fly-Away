const targetURL = "https://bsky.app";
const twitterRegex = /https?:\/\/([a-z0-9]\.)?(x|twitter)\.com(\/)?/;
const pages = ["home", "search", "explore", "settings", "messages", "notifications"];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && twitterRegex.test(tab.url)) {
    const parsedUrl = new URL(tab.url);
    const params = new URLSearchParams(parsedUrl.search);
    if (!params.get('no-redirect')) {
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
        chrome.tabs.update(tabId, { url: targetCompleteURL });
        return { redirectUrl: targetCompleteURL };
    }
  }
});