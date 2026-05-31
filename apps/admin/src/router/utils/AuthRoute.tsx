import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/user-store';

export default function AuthRoute() {
  const { isLogin } = useAuthStore();
  const location = useLocation();

  if (!isLogin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
