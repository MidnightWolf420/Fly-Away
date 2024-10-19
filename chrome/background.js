const targetURL = "https://bsky.app/";
const twitterRegex = /https?:\/\/(x|twitter)\.com/;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && twitterRegex.test(tab.url)) {
    const parsedUrl = new URL(tab.url);
    const params = new URLSearchParams(parsedUrl.search);
    if (!(params.get('no-redirect') || params.get('no-redirect') === 'true')) {
      chrome.tabs.update(tabId, { url: targetURL });
    }
  }
});
