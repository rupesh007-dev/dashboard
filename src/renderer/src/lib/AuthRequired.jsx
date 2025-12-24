import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthRequired = () => {
  const loggedIn = useSelector((state) => state.user.loggedIn);
  return loggedIn ? <Outlet /> : <Navigate to="/signin" replace />;
};
