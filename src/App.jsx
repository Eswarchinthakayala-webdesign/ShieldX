import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layout/app-layout'
import LandingPage from './pages/LandingPage'
import ProtocolPage from './pages/ProtocolPage'
import ArchitecturePage from './pages/ArchitecturePage'
import SecurityPage from './pages/SecurityPage'
import AboutPage from './pages/AboutPage'
import WhitepaperPage from './pages/WhitepaperPage'
import DocsPage from './pages/DocsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import InitializeIdentityPage from './pages/InitializeIdentityPage'
import DashboardPage from './pages/DashboardPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const router=createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
      },
      {
        path: "/protocol",
        element: <ProtectedRoute><ProtocolPage /></ProtectedRoute>
      },
      {
        path: "/architecture",
        element: <ProtectedRoute><ArchitecturePage /></ProtectedRoute>
      },
      {
        path: "/security",
        element: <ProtectedRoute><SecurityPage /></ProtectedRoute>
      },
      {
        path: "/about",
        element: <AboutPage />
      },
      {
        path: "/whitepaper",
        element: <ProtectedRoute><WhitepaperPage /></ProtectedRoute>
      },
      {
        path: "/docs",
        element: <ProtectedRoute><DocsPage /></ProtectedRoute>
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/signup",
        element: <SignupPage />
      },
      {
        path: "/initialize-identity",
        element: <ProtectedRoute><InitializeIdentityPage /></ProtectedRoute>
      }
      ]
  }
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App