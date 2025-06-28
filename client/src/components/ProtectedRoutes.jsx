import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";
import { useLoadUserQuery } from "@/features/api/authApi";

export const ProtectedRoute = ({children}) => {
    const { isError, error } = useLoadUserQuery();
    const { isAuthenticated } = useSelector(store=>store.auth);

    if (isError && error?.status === 401) return <Navigate to="/login" />;
    if (!isAuthenticated) return <Navigate to="/login" />;
    return children;
}
export const AuthenticatedUser = ({children}) => {
    const { isAuthenticated } = useSelector(store=>store.auth);
    if(isAuthenticated){
        return <Navigate to="/"/>
    }
    return children;
}
export const AdminRoute = ({children}) => {
    const { isError, error } = useLoadUserQuery();
    const {user, isAuthenticated} = useSelector(store=>store.auth);
    if (isError && error?.status === 401) return <Navigate to="/login" />;
    if(!isAuthenticated || user?.role !== "instructor"){
        return <Navigate to="/login"/>
    }
    return children;
}
export const SuperAdminRoute = ({ children }) => {
    const { isError, error } = useLoadUserQuery();
    const user = useSelector((state) => state.auth.user);
    if (isError && error?.status === 401) return <Navigate to="/login" />;
    if (!user || user.role !== "superadmin") {
      return <Navigate to="/login" replace />;
    }
    return children;
};