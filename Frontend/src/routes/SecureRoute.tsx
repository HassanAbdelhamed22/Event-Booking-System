import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/UI/Loading";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

interface SecureRouteProps {
  allowedRoles: Array<"admin" | "user">;
}

const SecureRoute: React.FC<SecureRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    toast.error("You need to be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default SecureRoute;
