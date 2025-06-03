import { useEffect } from "react";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/api/auth.api";
import { resetUser } from "@/redux/slices/userSlice";

export default function LogoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    dispatch(resetUser());
    logoutUser();
    navigate("/auth/login");
  }, [dispatch, navigate]); 

  return null;
}
