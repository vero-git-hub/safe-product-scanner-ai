chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "analyzeText") {
        const selectedText = message.text;

        console.log("Message received in background.js:", message);

        if (chrome.aiOriginTrial && chrome.aiOriginTrial.languageModel) {
            try {
                console.log("Checking AI capabilities...");
                const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();
                console.log("Capabilities:", capabilities);

                if (capabilities.available !== 'readily') {
                    console.error("AI model is unavailable. State:", capabilities.available);
                    sendResponse({ success: false, error: "AI model is unavailable. Please try again later." });
                    return;
                }

                console.log("Creating AI session...");
                const session = await chrome.aiOriginTrial.languageModel.create({
                    systemPrompt: 'You are an assistant specialized in analyzing product components and assessing their safety. Please respond in English only.',
                });

                console.log("AI session created:", session);

                console.log("Sending request to AI...");
                const result = await session.prompt(
                    `Analyze whether "${selectedText}" is a product component and assess its safety. Provide the response in English only.`
                );

                console.log("AI response:", result);
                sendResponse({ success: true, result });
            } catch (error) {
                console.error("Error during text analysis:", error);
                sendResponse({ success: false, error: error.message });
            }
        } else {
            console.error("Prompt API is unavailable.");
            sendResponse({ success: false, error: "Prompt API is unavailable." });
        }
    }

    return true;
});