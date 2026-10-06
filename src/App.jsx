import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Skills from "./pages/Skills";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import AdminLayout from "./components/AdminLayout";
import About from "./pages/About";
import Blogs from "./pages/Blogs";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="skills" element={<Skills />} /> {/* <-- Add this route */}
        <Route path="about" element={<About />} />
        <Route path="blogs" element={<Blogs />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
