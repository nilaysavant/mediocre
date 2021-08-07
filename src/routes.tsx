import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/main/startup" />,
  },
  {
    path: '/main',
    // component: lazy(() => import('src/layouts/Auth')),
    routes: [
      {
        path: '/main/startup',
        exact: true,
        // component: lazy(() => import('src/views/Login')),
      },
      {
        component: () => <Redirect to="/main/startup" />,
      },
    ],
  },
  {
    route: '*',
    component: <Redirect to="/main/startup" />
  },
]
