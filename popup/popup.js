const $participantRequestsFilteringKeywords = document.querySelector('#participant_requests_filter');

// 處理使用者輸入並儲存模板
$participantRequestsFilteringKeywords.addEventListener('input', (e) => {
	const { value } = e.currentTarget;

	// 使用 chrome.storage 同步設定
	chrome.storage.sync.set({ participantRequestsFilteringKeywords: value });
});

let keywords = "";
// 取得 storage 中的模板
async function fetchData() {
	let { participantRequestsFilteringKeywords } = await chrome.storage.sync.get(['participantRequestsFilteringKeywords']);

	$participantRequestsFilteringKeywords.value = participantRequestsFilteringKeywords;
	keywords = participantRequestsFilteringKeywords;
}

// scroll down and check
const button = document.querySelector('#toggle_filtering');

let scrollDown = false;
let intervalId = null; // 用來存儲滾動的 interval ID
button.addEventListener('click', () => {
	scrollDown = !scrollDown;

	if (button.textContent === '篩選中...') {
		button.textContent = '開始篩選';  // when user want to stop
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: "stopScrolling", intervalId: intervalId }, (response) => {
				if (response && response.success) {
					console.log("滾動已停止");
				}
			});
		});
	} else {
		button.textContent = '篩選中...'; // when user want to filter
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: "startScrolling", keywords: keywords }, (response) => {
				if (response && response.success) {
					console.log("滾動已開始");
					intervalId = response.intervalId;
				}
			});
		});
	}
});

// 由於每次重新打開 popup，就等同打開新視窗，所以使用 onload 重新取得資料
window.onload = () => {
	fetchData();
}