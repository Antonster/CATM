import { memo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoutes = () => {
	const isAuth = useAuth();
	if (!isAuth) {
		return <Navigate to={"/login"} />;
	}
	return <Outlet />;
};

export default memo(ProtectedRoutes);
