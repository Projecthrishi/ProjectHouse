import React, { useEffect, useState } from "react";
import axios from "axios";

const StorePage = () => {
  const [projects, setProjects] = useState([]);
  const rawUser = localStorage.getItem("user");
  const user = rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/projects`)
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      });
  }, []);

 const handleBuyNow = async (project) => {
  try {
    // Get user data
    const userString = localStorage.getItem("user");
    if (!userString) {
      alert("❌ Please login to make a purchase");
      return;
    }
    const user = JSON.parse(userString);
     const token = user.token;

    // Create order
    const orderRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/orders`, {
      amount: project.price},
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { id: order_id, amount, currency } = orderRes.data;

    const options = {
      key: "rzp_test_6ayj8R3LzCrrQd",
      amount: amount.toString(),
      currency,
      name: "Student Project Store",
      description: project.title,
      order_id,
      handler: async function (response) {
        try {
          // Verify payment with all required data
          const verifyRes = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/payment/verify`,
            {
              ...response,
              userId: user._id,
              projectId: project._id
            }
          );

          if (verifyRes.data.success) {
            // Get download link
            const downloadRes = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/download/${project._id}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

            // Trigger download
            if (downloadRes.data.downloadLink) {
              const link = document.createElement("a");
              link.href = downloadRes.data.downloadLink;
              link.setAttribute("download", "");
              document.body.appendChild(link);
              link.click();
              link.remove();
              alert("✅ Purchase successful! Download started.");
            }
          } else {
            alert("❌ Payment verification failed");
          }
        } catch (err) {
          console.error("❌ Post-payment error:", err);
          alert("❌ Something went wrong after payment.");
        }
      },
      prefill: {
        name: user.name || "User",
        email: user.email || "user@example.com",
        contact: user.phone || "9999999999"
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error("Payment error:", err);
    alert("❌ Payment failed. Try again.");
  }
};
  return (
    <div className="store-container">
      <h2 className="store-title">Available Student Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p><strong>Stack:</strong> {project.techStack?.join(", ") || "N/A"}</p>
            <p><strong>Price:</strong> ₹{project.price}</p>
            <div className="button-group">
              {project.demoLink ? (
  <a
    href={project.demoLink}
    target="_blank"
    rel="noreferrer"
    className="preview-button"
  >
    Live Demo
  </a>
) : (
  <button className="preview-button" disabled>
    No Demo
  </button>
)}
              <button
                className="buy-now-button"
                onClick={() => handleBuyNow(project)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;



