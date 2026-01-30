import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RoutesUrls } from './utils/enums/routes-url';

import LoginController from '@/pages/login/index.page';
import RegisterController from '@/pages/register/index.page';
import DashboardController from '@/pages/dashboard/index.page';
import RouteGuard from '@/components/route-guard';

export function RouterProvider() {
  const publicRoutes = [
    {
      path: RoutesUrls.BASE_URL,
      element: <LoginController />,
    },
    {
      path: RoutesUrls.REGISTER,
      element: <RegisterController />,
    },
  ];

  const privateRoutes = [
    {
      path: RoutesUrls.DASHBOARD,
      element: <DashboardController />,
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        <Route element={<RouteGuard />}>
          {privateRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
