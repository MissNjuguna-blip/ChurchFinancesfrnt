import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { Route,BrowserRouter as Router,Routes } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import NotFound from './components/NotFound'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
import NotAuthorised from './components/NotAuthorised'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import ProtectedRoute from './components/context/ProtectedRoute'
import RegisterContributions from './components/admin/RegisterContributions'
import ViewContributions from './components/admin/ViewContributions'
import RegisterExpenses from './components/admin/RegisterExpenses'
import ViewExpenses from './components/admin/ViewExpenses'
import ViewAuditLogs from './components/admin/ViewAuditLogs'
import LandingPage from './components/LandingPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* AdminRoutes */}
            <Route path='/admin-dashboard' element={
            <ProtectedRoute>
              <AdminLayout/>
            </ProtectedRoute>
          }>
            <Route path='' element={<AdminDashboard/>}/>
            <Route path='register-contributions' element={<RegisterContributions/>}/>
            <Route path='view-contributions' element={<ViewContributions/>}/>
            <Route path='register-expenses' element={<RegisterExpenses/>}/>
            <Route path='view-expenses' element={<ViewExpenses/>}/>
            <Route path='view-auditlogs' element={<ViewAuditLogs/>}/>
          </Route>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/login' element={<LogIn />} /> 
            <Route path='/signup' element={<SignUp />} />
            <Route path='/not-authorised' element={<NotAuthorised />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
