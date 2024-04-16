import { useLoaderData, useOutlet } from "react-router-dom";
import { AuthProvider } from "../../hooks/useAuth";

export const AuthLayout = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>{outlet}</AuthProvider>
  );
};