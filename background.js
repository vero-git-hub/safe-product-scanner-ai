chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background.js:", message);

    if (message.action === "analyzeText") {
        const selectedText = message.text.trim();

        (async () => {
            if (chrome.aiOriginTrial && chrome.aiOriginTrial.languageModel) {
                try {
                    const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();

                    if (capabilities.available === 'readily') {
                        const session = await chrome.aiOriginTrial.languageModel.create({
                            systemPrompt: 'You are a chemical analysis assistant. Your task is to determine if a given word represents a chemical component or substance that could be part of the composition of a medicine or cosmetic product. Respond strictly in English.',
                        });

                        try {
                            const result = await session.prompt(
                                `Check if "${selectedText}" is a chemical component or substance used in the composition of medicine or cosmetics?
                                If no, answer only "This is not a chemical component or substance."
                                If yes, answer "This is a chemical component.", and whether the component is safe for health, and how it affects health.`
                            );

                            sendResponse({ success: true, result });
                        } catch (error) {
                            console.error("Error during AI request:", error);
                            sendResponse({ success: false, error: error.message });
                        } finally {
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