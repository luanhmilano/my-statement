
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RoutesUrls } from './utils/enums/routes-url';

import LoginController from './pages/login/index.page';

export function RouterProvider() {
  const routes = [
    {
      path: RoutesUrls.LOGIN,
      element: <LoginController />,
    },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}