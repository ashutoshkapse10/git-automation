import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";
import { parse, MathNode } from "mathjs";

const safeEvaluate = (expr: string) => {
  const node = parse(expr);
  const validateNode = (n: MathNode) => {
    if (n.type === "OperatorNode") {
      const op = (n as any).op;
      const args = (n as any).args as MathNode[];
      if (!["+", "-", "*", "/", "^"].includes(op)) {
        throw new Error("Invalid operator");
      }
      args.forEach(validateNode);
    } else if (n.type === "ConstantNode") {
      return;
    } else if (n.type === "ParenthesisNode") {
      validateNode((n as any).content);
    } else {
      throw new Error("Disallowed expression");
    }
  };
  validateNode(node);
  return node.evaluate();
};

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
      const result = safeEvaluate(userInput);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Helmet>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; object-src 'none';" />
        <meta http-equiv="X-Frame-Options" content="DENY" />
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="no-referrer" />
        <meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=()" />
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

      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
};

export default VulnerableComponent;