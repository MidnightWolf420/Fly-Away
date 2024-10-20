const targetURL = "https://bsky.app";
const twitterRegex = /https?:\/\/([a-z0-9]\.)?(x|twitter)\.com(\/)?/;
const pages = ["home", "search", "explore", "settings", "messages", "notifications"];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && twitterRegex.test(tab.url)) {
    const parsedUrl = new URL(tab.url);
    const params = new URLSearchParams(parsedUrl.search);
    if (!params.get('no-redirect')) {
        let path = parsedUrl.pathname.split('/')[1];
        if(/https?:\/\/(x|twitter)\.com\/[a-zA-Z0-9-_]+$/i && !new RegExp(`(${pages.join("|")})`, "i").test(path)) {
            chrome.tabs.update(tabId, { url: `${targetURL}/search?q=${path}` });
        } else if(/https?:\/\/(x|twitter)\.com\/search(\/)?\?q=/i) {
            chrome.tabs.update(tabId, { url: `${targetURL}/search?q=${params.get('q')||""}` });
        } else if(/https?:\/\/(x|twitter)\.com\/settings/i) {
            chrome.tabs.update(tabId, { url: `${targetURL}/settings` });
        } else if(/https?:\/\/(x|twitter)\.com\/messages/i) {
            chrome.tabs.update(tabId, { url: `${targetURL}/messages` });
        } else if(/https?:\/\/(x|twitter)\.com\/notifications/i) {
            chrome.tabs.update(tabId, { url: `${targetURL}/notifications` });
        } else chrome.tabs.update(tabId, { url: targetURL });
        
    }
  }
});