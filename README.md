# Chrome Extensions - Safe Product Scanner (Gemini Nano AI)
Analyze chemical components in cosmetics and medicines effortlessly using Chrome extension. Safe Product Scanner AI demonstrates the practical application of cutting-edge AI technology to provide insights into product safety.

The Prompt API and Gemini Nano AI model can enhance everyday tasks by providing intelligent insights directly within the browser. This project was developed for the [Google Chrome Built-in AI Challenge](https://googlechromeai.devpost.com/).

## Purpose
To help users protect themselves and their loved ones from harmful components found in everyday products. Now you don’t have to google every ingredient in your favorite shampoo.  With this extension, the safety of a substance can be determined with just one click. 

This significantly speeds up the process of selecting safe products and encourages sellers to prioritize consumer safety.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Requirements](#requirements)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Key Files](#key-files)
- [Limitations](#limitations)
- [Enhancements](#enhancements)
- [Contribution](#contribution)
- [License](#license)

## Features
* **Component Analysis:** Quickly checks if the selected word represents a component or substance, providing a brief safety-focused description.
* **Interactive Popup:** Displays analysis results dynamically near the selected text.
* **Request Cancellation:** Allows users to cancel ongoing AI requests, preventing delays and ensuring relevant responses.

## Technologies
* Languages: JavaScript, HTML, CSS.
* APIs: Prompt API (Gemini Nano AI Model), Chrome Extensions API.
* Tools: IntelliJ IDEA Ultimate, Chrome DevTools.

## Installation
1. Ensure you are using Google Chrome.
2. Enable experimental flags:
    * Prompt API for Gemini Nano.
    * Optimization Guide On Device Model.
3. Obtain a token for the Prompt API Origin Trial and add it to manifest.json.
4. Download or clone the extension repository.
5. Load the extension:
    1. Open chrome://extensions/.
    2. Enable Developer Mode.
    3. Click Load unpacked and select the extension folder.
6. Refresh any open webpages to activate the extension.

### Requirements
* Google Chrome 131+ or Chrome Dev.
* At least 5 GB of free disk space for downloading the AI model.
* A valid Origin Trial token.

## Usage
1. Highlight a word on any webpage.
2. A popup appears:
    * Displays "Loading..." during processing.
    * Shows the result when analysis is complete.
3. Close the popup by clicking "X" or outside the popup area.

### How It Works
* Analysis Process:
  * Highlighting a word sends a request to the Prompt API through the **Gemini Nano AI model.**
  * The **background script** handles the request and response.
* Dynamic Popup Updates:
  * **Loading:** Shows a progress indicator.
  * **Canceled:** Aborts the operation without displaying a stale result.
  * **Complete:** Displays the result or an error message.

### Key Files
* **manifest.json:** Defines extension permissions and settings.
* **content.js:** Manages webpage interaction and popup behavior.
* **background.js:** Handles requests to the Prompt API.

### Limitations
* Designed to work with a couple of words selections.
* Not guaranteed to analyze words unrelated to chemical components.
* Requires an active internet connection.

## Enhancements
1. **Performance Optimization:** Reduce response times for faster user interactions.
2. Customization:
    * Popup appearance (color, size, font).
    * Language settings for interface and AI responses.
    * Disable the extension on specific webpages or domains.
3. Accessibility Improvements: Better keyboard navigation and screen reader support.
4. Detailed Response Options: Toggle between brief and comprehensive results.

## Contribution
Contributions are welcome! Submit pull requests or propose ideas via the Issues tab to enhance Safe Product Scanner AI.

## License
Licensed under the MIT License. See the LICENSE file for details.