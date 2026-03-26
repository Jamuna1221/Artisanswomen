import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react'
import Home from './pages/Home/Home'
import SignIn from "./pages/SignIn/SignIn";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}
