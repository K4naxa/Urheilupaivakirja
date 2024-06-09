import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const StudentRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/kirjaudu" />;
  }

  if (!user.email_verified) {
    // user has not verified their email
    return <Navigate to="/vahvista-sahkoposti" />;
  }

  if (user.role !== 3) {
    //user is not a student but admin/visitor
    if (user.role === 1) {
      return <Navigate to="/opettaja" />;
    } else if (user.role === 2) {
      return <Navigate to="/vierailija" />;
    }
    //TODO: else logout and navigate to login with a message
    else {
      return <Navigate to="/kirjaudu" />;
    }
  }
  return children;
};

export default StudentRoute;
