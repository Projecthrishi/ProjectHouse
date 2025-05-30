import React, { useState } from "react";
import axios from "axios";


const AddProjectForm = ({ onProjectAdded }) => {
const [formData, setFormData] = useState({
title: "",
description: "",
price: "",
techStack: "",
downloadLink: "",
});

const [status, setStatus] = useState("");

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();

// Convert techStack string to array
const techStackArray = formData.techStack
.split(",")
.map((tech) => tech.trim());

try {
const response = await axios.post("http://localhost:5000/api/projects", {
...formData,
techStack: techStackArray,
});

setStatus("✅ Project added successfully!");
onProjectAdded(response.data); // optional, to update UI

// Reset form
setFormData({
title: "",
description: "",
price: "",
techStack: "",
downloadLink: "",
});

// Clear status after 3 seconds
setTimeout(() => setStatus(""), 3000);
} catch (err) {
console.error(err);
setStatus("❌ Error adding project.");
}
};

return (
<div className="project-form-container">
<h2 className="form-heading">Add New Project</h2>
{status && <p className="status-message">{status}</p>}
<form onSubmit={handleSubmit} className="form-grid">
<input
type="text"
name="title"
placeholder="Project Title"
value={formData.title}
onChange={handleChange}
className="form-input"
required
/>
<input
type="number"
name="price"
placeholder="Price"
value={formData.price}
onChange={handleChange}
className="form-input"
required
/>
<textarea
name="description"
placeholder="Project Description"
value={formData.description}
onChange={handleChange}
className="form-input textarea"
rows={3}
/>
<input
type="text"
name="techStack"
placeholder="Tech Stack (comma separated)"
value={formData.techStack}
onChange={handleChange}
className="form-input"
/>
<input
type="url"
name="downloadLink"
placeholder="Download Link"
value={formData.downloadLink}
onChange={handleChange}
className="form-input"
/>
<button
type="submit"
className="submit-button"
>
Submit
</button>
</form>
</div>
);
};

export default AddProjectForm;