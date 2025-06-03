import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalRoutes from "./globalRoutes";


const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<GlobalRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;