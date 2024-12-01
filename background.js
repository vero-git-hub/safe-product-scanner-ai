chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background.js:", message);

    if (message.action === "analyzeText") {
        const selectedText = message.text;
        console.log("Analyze request received for text:", selectedText);

        (async () => {
            if (chrome.aiOriginTrial && chrome.aiOriginTrial.languageModel) {
                try {
                    console.log("Prompt API is available.");
                    const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();
                    console.log("Model capabilities:", capabilities);

                    if (capabilities.available === 'readily') {
                        const session = await chrome.aiOriginTrial.languageModel.create({
                            systemPrompt: 'You are an assistant specialized in analyzing product components and assessing their safety. Please respond in English only.',
                        });

                        try {
                            console.log("Sending request to AI...");
                            const result = await session.prompt(
                                `Check if this word "${selectedText}" is a component or substance of a medicine or cosmetic. Provide the response in English only.`
                            );

                            console.log("AI response:", result);
                            sendResponse({ success: true, result });
                            console.log("Response sent:", { success: true, result });
                        } catch (error) {
                            console.error("Error during AI request:", error);
                            sendResponse({ success: false, error: error.message });
                        } finally {
                            console.log("Destroying AI session...");
                            session.destroy();
                        }
                    } else {
                        sendResponse({ success: false, error: `Model unavailable: ${capabilities.available}` });
                    }
                } catch (error) {
                    console.error("Error during Prompt API initialization:", error);
                    sendResponse({ success: false, error: error.message });
                }
            } else {
                console.error("Prompt API is unavailable.");
                sendResponse({ success: false, error: "Prompt API is unavailable." });
            }
        })();

        return true;
    }
});