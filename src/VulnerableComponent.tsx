import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";

const VulnerableComponent: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState<unknown>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/data?query=${encodeURIComponent(userInput)}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/data?query=`);
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
      console.log(parsed);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Helmet>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; object-src 'none';" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="no-referrer" />
        <meta httpEquiv="Permissions-Policy" content="geolocation=(self)" />
      </Helmet>
      <div>
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
              (key.toLowerCase().includes("secret") ||
                key.toLowerCase().includes("token"))
                ? "***"
                : value,
            2
          )}
        </pre>
      </div>
    </>
  );
};

export default VulnerableComponent;