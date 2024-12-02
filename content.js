let currentAbortController = null;
let currentRequestId = null;

async function analyzeWithAI(selectedText) {
    showLoadingPopup(selectedText);

    const requestId = Date.now();
    currentRequestId = requestId;

    if (currentAbortController) {
        currentAbortController.abort();
    }
    currentAbortController = new AbortController();

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

        if (requestId !== currentRequestId) {
            return;
        }

        if (response.success) {
            showPopup(selectedText, response.result);
        } else {
            console.error("Error during text analysis:", response.error);
            showPopup(selectedText, `Error: ${response.error}`);
        }
    } catch (error) {
        if (requestId !== currentRequestId) {
            return;
        }

        console.error("Error interacting with background.js:", error.message);
        showPopup(selectedText, `Error: ${error.message}`);
    } finally {
        if (requestId === currentRequestId) {
            currentAbortController = null;
            currentRequestId = null;
        }
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

    popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>${selectedText}</strong>
            <button id="close-popup" style="background: none; border: none; font-size: 16px; cursor: pointer;">✖</button>
        </div>
        <div>${analysisResult}</div>
    `;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
    }

    document.body.appendChild(popup);

    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        popup.remove();

        if (currentAbortController) {
            currentAbortController.abort();
            currentAbortController = null;
        }
    });

    document.addEventListener('mousedown', (event) => {
        if (!popup.contains(event.target)) {
            popup.remove();

            if (currentAbortController) {
                currentAbortController.abort();
                currentAbortController = null;
                currentRequestId = null;
            }
        }
    }, { once: true });
}

document.addEventListener('mouseup', () => {
    const popup = document.getElementById('ai-popup');
    if (popup && popup.contains(event.target)) {
        return;
    }

    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        analyzeWithAI(selectedText);
    }
});