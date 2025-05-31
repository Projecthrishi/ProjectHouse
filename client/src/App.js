import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProjectList from "./components/ProjectList";
import AddProjectForm from "./components/AddProjectForm";
import StorePage from "./components/StorePage";
import AuthPage from "./Pages/AuthPage";
import axios from "axios";
import "./style.css";
import "./index.css";

// ✅ Admin Panel component (define only once)
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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects`);
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
        <Route path="/signup" element={<Signup />} />
        
        <Route
          path="/admin"
          element={
            <AdminPage
              projects={projects}
              setProjects={setProjects}
              handleProjectAdded={handleProjectAdded}
            />
          }
        />
        
        <Route path="/store" element={<StorePage />} />

        {/* ✅ New Route for normal users after login */}
        <Route
  path="/add-project"
  element={<AddProjectForm onProjectAdded={handleProjectAdded} />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
