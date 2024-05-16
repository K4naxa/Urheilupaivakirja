import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RedirectIfAuthenticated = ({ children }) => {
    const { user } = useAuth();  // Assuming `useAuth` returns an object with the user or null
    const isAuthenticated = Boolean(user);  // Determine if the user is authenticated

    if (isAuthenticated) {
        // Determine redirection based on user role
        let navigateTo = "/";
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
        return <Navigate to={navigateTo} replace />;
    }

    return children;
};

export default RedirectIfAuthenticated;
