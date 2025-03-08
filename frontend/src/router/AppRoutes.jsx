import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Student from "../pages/Student";
import Login from "../components/Login";
import AdminDashbord from "../components/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/student" element={<Student />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashbord />} />
    </Routes>
  );
}

export default AppRoutes;
