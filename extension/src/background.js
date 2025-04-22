chrome.runtime.onInstalled.addListener(() => {
  console.log("LeetCode AI Assistant has been installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  return true;
});
