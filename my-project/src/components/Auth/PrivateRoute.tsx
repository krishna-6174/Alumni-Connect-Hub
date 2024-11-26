import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
const PrivateRoute = () => {
  const authContext = useAuth();
  // //const role = Cookies.get("role");

  if (!authContext) {
    return <Navigate to="/" />; // Redirect to homepage if not authenticated
  }

  // Redirect based on the role
  return <>
  <Outlet />
</>
};

export default PrivateRoute;
