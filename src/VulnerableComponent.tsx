import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

const VulnerableComponent: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [data, setData] = useState<unknown>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/data?q=${encodeURIComponent(userInput)}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/data?q=`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    loadData();
  }, []);

  const handleCommand = (cmd: unknown) => {
    console.log("Command executed:", cmd);
  };

  const runEval = () => {
    try {
      const cmd = JSON.parse(userInput);
      handleCommand(cmd);
    } catch {
      console.error("Invalid command");
    }
  };

  return (
    <>
      <Helmet>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self';" />
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
        <div>{userInput}</div>
        <pre>{JSON.stringify(data)}</pre>
      </div>
    </>
  );
};

export default VulnerableComponent;