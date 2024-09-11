import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return null;
};

export default LogoutPage;
