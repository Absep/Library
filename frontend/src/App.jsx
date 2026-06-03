import {
  Routes,
  Route,
} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import BorrowedBooks from './pages/BorrowedBooks'
import AdminBooks from './pages/AdminBooks'
import History from './pages/History'
import OAuthSuccess from './pages/OAuthSuccess'

import ProtectedRoute
  from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-books"
        element={
          <ProtectedRoute>
            <AdminBooks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/oauth-success"
        element={<OAuthSuccess />}
      />

      <Route
        path="/borrowed-books"
        element={
          <ProtectedRoute>
            <BorrowedBooks />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/books"
        element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        }
      />
    </Routes>

    
  )
}

export default App