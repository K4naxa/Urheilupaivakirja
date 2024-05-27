import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RedirectIfNotAuthenticated = ({ children }) => {
    const { user } = useAuth(); 
    const isAuthenticated = Boolean(user);  

    if (!isAuthenticated) {
        return <Navigate to="/kirjaudu" replace />;
    }

    return children;
};

export default RedirectIfNotAuthenticated;