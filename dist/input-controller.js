// Description: This script listens for keyup events and replaces the snippet with the full text.

document.addEventListener('keyup', function (event) {
    chrome.storage.sync.get("snippets", function (data) {
        const snippets = data.snippets || {};

        // Get all input fields from the page
        const inputFields = document.querySelectorAll('input[type="text"], textarea');

        inputFields.forEach(inputField => {
            for (let snippet in snippets) {
                const char = '#';
                const snippetWithChar = char + snippet;
                // Check if the input field ends with the snippet
                if (inputField.value.endsWith(snippetWithChar)) {
                    inputField.value = inputField.value.replace('#', '');
                    inputField.value = inputField.value.replace(snippet, snippets[snippet]);
                }
            }
        });
    });
});