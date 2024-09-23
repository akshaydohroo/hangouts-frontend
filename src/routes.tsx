import { ErrorBoundary } from 'react-error-boundary'
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import App from './App'
import Account from './modules/Account'
import Dashboard from './modules/Dashboard'
import Login from './modules/Login'
import RootErrorFallback from './modules/RootErrorFallback'
import RouteError from './modules/RouteError'
import Signup from './modules/Signup'

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: <Dashboard />,
    children: [
      {
        path: 'account',
        element: <Account />,
      },
    ],
  },
  {
    index: true,
    element: <Dashboard />,
  },
]
export default createBrowserRouter([
  {
    element: (
      <ErrorBoundary fallbackRender={RootErrorFallback}>
        <App />
      </ErrorBoundary>
    ),
    children: routes,
    errorElement: <RouteError />,
  },
])
