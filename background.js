const defaultParticipantRequestsFilteringKeywords = `好
嗯
超好笑
讓我加入
他媽的
精選`;

// 當套件安裝或更新時執行（當 chrome 更新時也會）
chrome.runtime.onInstalled.addListener(async () => {
	const { participantRequestsFilteringKeywords } = await chrome.storage.sync.get(['participantRequestsFilteringKeywords']);
	// 當現有模板為空時，寫入預設模板
	if (!participantRequestsFilteringKeywords) {
		chrome.storage.sync.set({ participantRequestsFilteringKeywords: defaultParticipantRequestsFilteringKeywords });
	}
})