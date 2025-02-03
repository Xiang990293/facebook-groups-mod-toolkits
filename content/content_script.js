let scrollInterval;

function startScrolling(keywords) {
    scrollInterval = setInterval(() => {
        window.scrollBy(0, 100); // 每次向下滾動20個像素
    }, 5000); // 每100毫秒滾動一次
    highlightKeywords(keywords);

	return scrollInterval;
}

function stopScrolling() {
    clearInterval(scrollInterval);
}

function highlightKeywords(keywords) {
    const bodyText = document.body.innerHTML;
    const keywordArray = keywords.split('\n').map(keyword => keyword.trim()).filter(keyword => keyword);
    
    if (keywordArray.length === 0) return; // 如果沒有有效的關鍵字，則返回

    // 使用正則表達式創建一個匹配所有關鍵字的模式
    const regexPattern = keywordArray.map(keyword => {
        return keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 轉義特殊字符
    }).join('|'); // 用 | 連接關鍵字

    // 替換 HTML 中的關鍵字為帶有高亮樣式的標籤
    const highlightedHTML = bodyText.replace(new RegExp(`(${regexPattern})`, 'gi'), '<span style="background-color: yellow;">$1</span>');

    document.body.innerHTML = highlightedHTML; // 更新頁面內容
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startScrolling") {
        try {
            const intervalId = startScrolling(request.keywords);
            sendResponse({ success: true, intervalId: intervalId });
        } catch (error) {
            console.error("Error in startScrolling:", error);
            sendResponse({ success: false, error: error.message });
        }
    } else if (request.action === "stopScrolling") {
        stopScrolling(request.intervalId);
        sendResponse({ success: true });
    }
	console.log("hihi! falied!")
	sendResponse({ success: false});
});