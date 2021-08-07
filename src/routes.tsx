import { lazy } from 'react'
import { RouteConfig } from 'react-router-config'
import { Redirect } from 'react-router-dom'

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/main/startup" />,
  },
  {
    path: '/main',
    component: lazy(() => import('src/layouts/Main')),
    routes: [
      {
        path: '/main/startup',
        exact: true,
        component: lazy(() => import('src/views/Startup')),
      },
      {
        path: '/main/settings',
        exact: true,
        component: lazy(() => import('src/views/Settings')),
      },
      {
        component: () => <Redirect to="/main/startup" />,
      },
    ],
  },
  {
    route: '*',
    component: () => <Redirect to="/main/startup" />,
  },
]

export default routes
