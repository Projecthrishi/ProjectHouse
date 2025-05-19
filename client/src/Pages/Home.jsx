import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";



const Home = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Available Projects</h1>
      <div>
        {projects.map((proj) => (
          <ProjectCard key={proj._id} project={proj} />
        ))}
      </div>
    </div>
  );
};

export default Home;
