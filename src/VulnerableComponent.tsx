import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";

const VulnerableComponent: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState<unknown>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/data?query=${encodeURIComponent(userInput)}`
      );
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
    <div>
      <Helmet>
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none';"
        />
        <meta http-equiv="X-Frame-Options" content="DENY" />
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta http-equiv="Permissions-Policy" content="geolocation=(self)" />
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

      <div>{userInput}</div>
    </div>
  );
};

export default VulnerableComponent;