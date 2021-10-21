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
        path: '/app/md-editor',
        exact: true,
        component: lazy(() => import('src/views/MdEditor')),
      },
      {
        path: '/app/settings',
        component: lazy(() => import('src/views/Settings')),
        routes: [
          {
            path: '/app/settings/general',
            exact: true,
            component: lazy(() => import('src/views/Settings/General')),
          },
          {
            path: '/app/settings/customization',
            exact: true,
            component: lazy(() => import('src/views/Settings/Customization')),
          },
          {
            component: () => <Redirect to="/app/settings/general" />,
          },
        ],
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
