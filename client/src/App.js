import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProjectList from "./components/ProjectList";
import AddProjectForm from "./components/AddProjectForm";
import StorePage from "./components/StorePage";
import AuthPage from "./Pages/AuthPage";
import axios from "axios";
import "./style.css";
import "./index.css";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isLoading: true,
    userRole: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/check`,
          { withCredentials: true }
        );
        
        if (response.data.isAuthenticated) {
          setAuthStatus({
            isAuthenticated: true,
            isLoading: false,
            userRole: response.data.user.role
          });
          
          // Check if user has required role
          if (requiredRole && response.data.user.role !== requiredRole) {
            alert("You don't have permission to access this page");
          }
        } else {
          alert("Please login first");
        }
      } catch (error) {
        alert("Please login first");
      }
    };

    checkAuth();
  }, [navigate, requiredRole]);

  if (authStatus.isLoading) {
    return <div>Loading...</div>;
  }

  if (!authStatus.isAuthenticated) {
    return null; // Already redirected to login
  }

  if (requiredRole && authStatus.userRole !== requiredRole) {
    return null; // Already redirected to login
  }

  return children;
};

// Admin Panel component
const AdminPage = ({ projects, setProjects, handleProjectAdded }) => (
  <div>
    <h2>Admin Panel</h2>
    <AddProjectForm onProjectAdded={handleProjectAdded} />
    <ProjectList projects={projects} setProjects={setProjects} />
  </div>
);

function App() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects`, {
        withCredentials: true
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const handleProjectAdded = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Login />} />
        
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage
                projects={projects}
                setProjects={setProjects}
                handleProjectAdded={handleProjectAdded}
              />
            </ProtectedRoute>
          }
        />
        
        <Route 
          path="/store" 
          element={
            <ProtectedRoute>
              <StorePage />
            </ProtectedRoute>
          } 
        />

        <Route
          path="/add-project"
          element={
            <ProtectedRoute requiredRole="project-manager">
              <AddProjectForm onProjectAdded={handleProjectAdded} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;