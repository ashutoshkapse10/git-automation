import React, { useState, useEffect } from "react";

// 🚨 Hardcoded secret (security issue)
const API_KEY = "ghp_12345FAKESECRET67890TOKEN";

const VulnerableComponent: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState<unknown>(null);

  // 🚨 Insecure API call with hardcoded token
  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://api.example.com/data?query=${userInput}&apikey=${API_KEY}`
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
        const res = await fetch(
          `https://api.example.com/data?query=&apikey=${API_KEY}`
        );
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadData();
  }, []);

  // 🚨 Dangerous eval usage
  const runEval = () => {
    try {
      eval(userInput); // ❌ Code injection risk
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>⚠️ Vulnerable Component</h2>

      {/* 🚨 No input validation */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter something"
      />

      <button onClick={fetchData}>Fetch Data</button>

      <button onClick={runEval}>Run Eval</button>

      {/* 🚨 XSS vulnerability */}
      <div
        dangerouslySetInnerHTML={{
          __html: userInput // ❌ Directly rendering user input
        }}
      />

      {/* 🚨 Logging sensitive info */}
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
};

export default VulnerableComponent;