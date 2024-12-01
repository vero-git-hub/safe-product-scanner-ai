console.log("Content script loaded successfully.");

async function analyzeWithAI(selectedText) {
    console.log("Sending a request to analyze the text in background.js...");
    showLoadingPopup(selectedText);

    try {
        const response = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Operation in background.js timed out."));
            }, 30000);

            chrome.runtime.sendMessage(
                { action: "analyzeText", text: selectedText },
                (response) => {
                    clearTimeout(timeout);
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                }
            );
        });

        if (response.success) {
            console.log("Analysis result:", response.result);
            showPopup(selectedText, response.result);
        } else {
            console.error("Error during text analysis:", response.error);
            showPopup(selectedText, `Error: ${response.error}`);
        }
    } catch (error) {
        console.error("Error interacting with background.js:", error.message);
        showPopup(selectedText, `Error: ${error.message}`);
    }
}

function showLoadingPopup(selectedText) {
    showPopup(selectedText, "Loading...");
}

function showPopup(selectedText, analysisResult) {
    const oldPopup = document.getElementById('ai-popup');
    if (oldPopup) {
        oldPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 'ai-popup';
    popup.style.position = 'absolute';
    popup.style.backgroundColor = '#f9f9f9';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';

    popup.innerHTML = `<strong>${selectedText}</strong><br>${analysisResult}`;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
    }

    document.body.appendChild(popup);
    //setTimeout(() => popup.remove(), 5000);
}

document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        analyzeWithAI(selectedText);
    }
});