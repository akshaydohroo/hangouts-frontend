import { ErrorBoundary } from 'react-error-boundary'
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import App from './App'
import Dashboard from './modules/Dashboard'
import RootErrorFallback from './modules/RootErrorFallback'
import Login from './modules/Login'
import Signup from './modules/Signup'
import RouteError from './modules/RouteError'

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
