console.log("Content script loaded successfully.");

document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        console.log("Selected:", selectedText);
        // TODO: call the API to analyze the text
    }
});
