import { lazy } from 'react'
import { RouteConfig } from 'react-router-config'
import { Redirect } from 'react-router-dom'

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/app" />,
  },
  {
    path: '/app',
    component: lazy(() => import('src/layouts/App')),
    routes: [
      {
        path: '/app/startup',
        exact: true,
        component: lazy(() => import('src/views/Startup')),
      },
      {
        path: '/app/settings',
        exact: true,
        component: lazy(() => import('src/views/Settings')),
      },
      {
        component: () => <Redirect to="/app/startup" />,
      },
    ],
  },
  {
    route: '*',
    component: () => <Redirect to="/app" />,
  },
]

export default routes
