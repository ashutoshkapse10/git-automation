import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";

const VulnerableComponent: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState<unknown>(null);

  const fetchData = async () => {
    try {
      const url = `/api/data?q=${encodeURIComponent(userInput)}`;
      const res = await fetch(url);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const url = `/api/data?q=`;
        const res = await fetch(url);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadData();
  }, []);

  const runEval = () => {
    try {
      const parsed = JSON.parse(userInput);
      setData(parsed);
    } catch (e) {
      console.error("Invalid JSON:", e);
    }
  };

  return (
    <div>
      <Helmet>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self';" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="no-referrer" />
        <meta httpEquiv="Permissions-Policy" content="geolocation=()" />
      </Helmet>
      <h2>⚠️ Vulnerable Component</h2>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter something"
      />
      <button onClick={fetchData}>Fetch Data</button>
      <button onClick={runEval}>Run Eval</button>
      <div>{DOMPurify.sanitize(userInput)}</div>
      <pre>
        {JSON.stringify(
          data,
          (key, value) =>
            typeof key === "string" &&
            (key.toLowerCase().includes("token") || key.toLowerCase().includes("password"))
              ? "[REDACTED]"
              : value,
          2
        )}
      </pre>
    </div>
  );
};

export default VulnerableComponent;