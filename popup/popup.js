document.getElementById('analyze').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: analyzeSelection
        });
    });
});

function analyzeSelection() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        console.log("We analyze:", selectedText);
        // TODO: call the API Chrome
    } else {
        alert("Select text for analysis.");
    }
}
