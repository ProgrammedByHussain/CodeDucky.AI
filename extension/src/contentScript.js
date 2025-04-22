chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProblemData") {
    try {
      const data = extractProblemData();
      sendResponse(data);
    } catch (error) {
      sendResponse({ error: error.message });
    }
  }
  return true;
});

function extractProblemData() {
  const titleElement = document.querySelector('[data-cy="question-title"]');
  const title = titleElement ? titleElement.textContent.trim() : "";

  const descriptionElement = document.querySelector(
    '[data-cy="question-content"]'
  );
  const description = descriptionElement
    ? descriptionElement.textContent.trim()
    : "";

  let code = "";
  let language = "";

  const languageSelector = document.querySelector('[data-cy="lang-select"]');
  if (languageSelector) {
    language = languageSelector.textContent.trim();
  }

  const codeLines = document.querySelectorAll(".view-line");
  if (codeLines && codeLines.length > 0) {
    code = Array.from(codeLines)
      .map((line) => line.textContent)
      .join("\n");
  }

  if (!code) {
    const codeTextarea = document.querySelector(
      'textarea[data-cy="code-area"]'
    );
    if (codeTextarea) {
      code = codeTextarea.value;
    }
  }

  if (!code) {
    const editorContainer =
      document.querySelector(".CodeMirror") ||
      document.querySelector(".monaco-editor");

    if (editorContainer) {
      const textContent = editorContainer.textContent;
      if (textContent) {
        code = textContent.trim();
      }
    }
  }

  return {
    title,
    description,
    code,
    language,
    url: window.location.href,
  };
}
