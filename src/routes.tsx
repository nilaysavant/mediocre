import { lazy } from 'react'
import { RouteConfig } from 'react-router-config'
import { Redirect } from 'react-router-dom'

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/main" />,
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
        component: () => <Redirect to="/main/startup" />,
      },
    ],
  },
  {
    route: '*',
    component: () => <Redirect to="/main" />,
  },
]

export default routes
