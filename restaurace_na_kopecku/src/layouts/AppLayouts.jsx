import React from "react";
import Navbar from "../Components/Ui/Navbar.jsx";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-6 flex-1">
        <Outlet />
      </main>
      {/* (volitelně) footer */}
    </div>
  );
}
