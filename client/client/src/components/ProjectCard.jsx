import React from "react";

const ProjectCard = ({ project }) => {
    return (
      <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem" }}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <p><strong>Tech Stack:</strong> {project.techStack?.join(", ")}</p>
        <p><strong>Price:</strong> ₹{project.price}</p>
        <a href={project.downloadLink} target="_blank" rel="noreferrer">Download</a>
      </div>
    );
  };
  
  export default ProjectCard;
  