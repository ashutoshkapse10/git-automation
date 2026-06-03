import React, { useState, useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";

const API_KEY = process.env.REACT_APP_API_KEY || "";

const VulnerableComponent: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState<unknown>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://api.example.com/data?query=${encodeURIComponent(userInput)}&apikey=${API_KEY}`
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

  function handleInput(input: string) {
    // parse and process input safely
    console.log("Processed input:", input);
  }

  const runEval = () => {
    try {
      handleInput(userInput);
    } catch (e) {
      console.error(e);
    }
  };

  const safeData = useMemo(() => {
    if (data && typeof data === "object") {
      return { publicField: (data as any).publicField };
    }
    return {};
  }, [data]);

  return (
    <>
      <Helmet>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self';" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="Referrer-Policy" content="no-referrer" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=()" />
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
        <pre>{JSON.stringify(safeData)}</pre>
      </div>
    </>
  );
};

export default VulnerableComponent;