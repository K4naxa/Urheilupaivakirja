import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = () => {
      if (user) {
        switch (user.role) {
          case 1:
            navigate("/opettaja");
            break;
          case 2:
            navigate("/vierailija");
            break;
          case 3:
            navigate("/");
            break;
        }
      } else {
        navigate("/kirjaudu");
      }
    };
    redirect();
  }, []);

  return <></>;
};

export default NoPage;