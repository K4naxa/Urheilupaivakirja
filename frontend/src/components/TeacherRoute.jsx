import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const TeacherRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/kirjaudu" />;
  }

  if (user.role !== 1) {
    //user is not admin but student or spectator
    if (user.role === 2) {
      return <Navigate to="/vierailija" />;
    } else if (user.role === 3) {
      return <Navigate to="/" />;
    }
    //TODO: else logout and navigate to login with a message
    else {
      return <Navigate to="/kirjaudu" />;
    }
  }
  return children;
};

export default TeacherRoute;
