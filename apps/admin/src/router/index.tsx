import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazyComponent } from './utils/lazy-component';
import AuthRoute from './utils/AuthRoute';

const router = createBrowserRouter([
  {
    element: <AuthRoute />,
    children: [
      {
        path: '/',
        element: lazyComponent(() => import('@/components/layout/RootLayout')),
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />,
          },
          {
            path: 'home',
            element: lazyComponent(() => import('@/pages/home')),
          },
          {
            path: '/content',
            children: [
              {
                path: 'list',
                element: lazyComponent(() => import('@/pages/content/list')),
              },
              {
                path: 'create',
                element: lazyComponent(() => import('@/pages/content/create')),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: lazyComponent(() => import('@/pages/login')),
  },
  {
    path: '*',
    element: lazyComponent(() => import('@/components/ui/404')),
  },
]);

export default router;
