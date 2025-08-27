import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CurtisWilliamsLive from "./CurtisWilliamsLive";
import SimpleAdmin from "./components/SimpleAdmin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CurtisWilliamsLive />} />
          <Route path="/admin" element={<SimpleAdmin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
