import axios from "axios";
import logo from "./logo.svg";
import "./styles/App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/greetings`);
      setMessage(data?.message || "");
    })();
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
      </Routes>
    </div>
  );
}

export default App;
