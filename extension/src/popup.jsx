import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./popup.css";

const Popup = () => {
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [problemData, setProblemData] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      try {
        const response = await chrome.tabs.sendMessage(tabs[0].id, {
          action: "getProblemData",
        });
        setProblemData(response);
      } catch (err) {
        setError("Make sure you are on a LeetCode problem page");
      }
    });
  }, []);

  const getHint = async () => {
    if (!problemData) {
      setError(
        "No problem data available. Make sure you are on a LeetCode problem page."
      );
      return;
    }

    setLoading(true);
    setError("");

    // local host for implementation testing 04/26/2025
    try {
      const response = await fetch("http://localhost:5000/hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemTitle: problemData.title,
          problemDescription: problemData.description,
          userCode: problemData.code,
          language: problemData.language,
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setHint(data.hint);
    } catch (err) {
      setError("Failed to get hint: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-container">
      <h1>CodeDucky.AI</h1>

      {problemData ? (
        <div className="problem-info">
          <h2>{problemData.title}</h2>
          <p>Language: {problemData.language}</p>
        </div>
      ) : (
        <p className="warning">
          No problem detected. Make sure you're on a LeetCode problem page.
        </p>
      )}

      <button
        className="hint-button"
        onClick={getHint}
        disabled={loading || !problemData}
      >
        {loading ? "Loading..." : "Get Hint"}
      </button>

      {error && <div className="error">{error}</div>}

      {hint && (
        <div className="hint-container">
          <h3>💡 Hint:</h3>
          <div className="hint-content">{hint}</div>
        </div>
      )}

      <div className="footer">
        <p>CodeDucky.AI v1.0.0</p>
      </div>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById("app"));
