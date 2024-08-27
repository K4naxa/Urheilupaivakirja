import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Call the logout function
    logout();

    // Redirect to the login page after logout and remove this page from history
    navigate("/kirjaudu", { replace: true });
  }, [logout, navigate]);

  return null;
};

export default LogoutPage;
