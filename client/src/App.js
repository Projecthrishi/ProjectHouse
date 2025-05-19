import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import AddProjectForm from "./components/AddProjectForm";
import StorePage from "./components/StorePage";
import axios from "axios";
import "./style.css"; // Optional: Your styles



const AdminPage = ({ projects, setProjects, handleProjectAdded }) => (
  <div>
    <h2>Admin Panel</h2>
    <AddProjectForm onProjectAdded={handleProjectAdded} />
    <ProjectList projects={projects} setProjects={setProjects} />
  </div>
);

const App = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
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
    <Routes>
      <Route
        path="/"
        element={
          <AdminPage
            projects={projects}
            setProjects={setProjects}
            handleProjectAdded={handleProjectAdded}
          />
        }
        
      />
      <Route path="/store" element={<StorePage projects={projects} />} />
    </Routes>
  );
};

export default App;
