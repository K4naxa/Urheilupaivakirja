import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RedirectIfAuthenticated = ({ children }) => {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);

  if (isAuthenticated) {
    let navigateTo = "/";
    if (user && user.role) {
      switch (user.role) {
        case 1:
          navigateTo = "/opettaja";
          break;
        case 2:
          navigateTo = "/vierailija";
          break;
        default:
          navigateTo = "/";
          break;
      }
    }
    return <Navigate to={navigateTo} replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
