import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LoginPage from "@/pages/auth/login";
import LogoutPage from "@/pages/auth/logout";
import NewPasswordPage from "@/pages/auth/new-password";
import RegisterPage from "@/pages/auth/register/registerPage";
import NotFoundPage from "@/pages/error/404";
import React from "react";
import { Routes, Route } from "react-router-dom";

const AuthRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="logout" element={<LogoutPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/new-password/:secretCode" element={<NewPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/validate/:secretCode" element={<h1>Register</h1>} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AuthRoute;
