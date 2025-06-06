import React, { useState } from "react";
import axios from "axios";

const AddProjectForm = ({ onProjectAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    techStack: "",
    file: null,
     demoLink: "", // for zip upload
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "dwepjfo0"); // replace with yours

    try {
      const res = await axios.post(
       `https://api.cloudinary.com/v1_1/duqdbbfbu/raw/upload`, // raw is key
        data
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("❌ Upload failed:", err);
      throw new Error("Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const techStackArray = formData.techStack
      .split(",")
      .map((tech) => tech.trim());

    try {
      if (!formData.file) {
        setStatus("❌ Please upload a ZIP file.");
        return;
      }
        
      // Upload file to Cloudinary
      const downloadLink = await uploadToCloudinary(formData.file);

      // Send to backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/projects`, {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        techStack: techStackArray,
        downloadLink,
        demoLink: formData.demoLink,
      });

      setStatus("✅ Project added successfully!");
      onProjectAdded(response.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        techStack: "",
        file: null,
      });

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
  placeholder="Live Demo URL"
  value={formData.demoLink}
  onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
/>

        <input
          type="file"
          name="file"
          accept=".zip"
          onChange={handleChange}
          className="form-input"
          required
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProjectForm;
