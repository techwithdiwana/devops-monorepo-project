import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Loading...");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
      })
      .catch(() => {
        setStatus("FAILED");
      });
  }, []);

  return (
    <div>
      <h1>Tech With Diwana DevOps Project</h1>

      <h2>API Gateway Status:</h2>

      <h3>{status}</h3>
    </div>
  );
}

export default App;