import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import JobApplicationsPage from './pages/JobApplicationsPage'
import LoginPage from './pages/LoginPage'
import RegisterUserPage from './pages/RegisterUserPage'
import TodoFormPage from './pages/TodoFormPage'
import TodoPage from './pages/TodoPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="expense-tracker" element={<DashboardPage />} />
              <Route path="job-applications" element={<JobApplicationsPage />} />
              <Route path="todos" element={<TodoPage />} />
              <Route path="todos/new" element={<TodoFormPage />} />
              <Route path="todos/:id/edit" element={<TodoFormPage />} />
              <Route path="register-user" element={<RegisterUserPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
