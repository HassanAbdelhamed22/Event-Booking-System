import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/UI/Loading";
import { useAuth } from "../context/AuthContext";

interface SecureRouteProps {
  allowedRoles: Array<"admin" | "user">;
}

const SecureRoute: React.FC<SecureRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default SecureRoute;
