import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CurtisWilliamsEnhanced from "./CurtisWilliamsEnhanced";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CurtisWilliamsEnhanced />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
