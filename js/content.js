console.log("Content script loaded successfully.");

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
    setTimeout(() => popup.remove(), 5000);
}

function analyzeText(text) {
    console.log("Analyzing the text:", text);
    showPopup(text, "Пример результата анализа");
}

document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        console.log("Selected:", selectedText);
        analyzeText(selectedText);
    }
});
