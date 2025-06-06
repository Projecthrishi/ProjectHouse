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
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/orders`, {
      amount: project.price,
    });

    const { id: order_id, amount, currency } = res.data;

    const options = {
      key: "rzp_test_6ayj8R3LzCrrQd",
      amount: amount.toString(),
      currency,
      name: "Student Project Store",
      description: project.title,
      order_id,
      handler: async function (response) {
        try {
          // 1. Verify payment
          const verifyRes = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/payment/verify`,
            response
          );

          alert("✅ Payment verified!");

          // ✅ Assuming you have user data from context or props
         const userString = localStorage.getItem("user");
    if (!userString) {
      alert("❌ User not logged in.");
      return;
    }

    const user = JSON.parse(userString);
    const userId = user._id;

          // 2. Save the purchase in DB
          await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/save`, {
            userId,
            projectId: project._id,
          });

          const downloadRes = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/download/${project._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`, // 👈 Include token for protect middleware
        },
      }
    );

    const downloadLink = downloadRes.data.downloadLink;

          // 3. Trigger download
          const link = document.createElement("a");
           link.href = downloadLink;
;
          link.setAttribute("download", "");
          document.body.appendChild(link);
          link.click();
          link.remove();

        } catch (err) {
          console.error("❌ Post-payment error:", err);
          alert("❌ Something went wrong after payment.");
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
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
              <a
                href={project.downloadLink}
                target="_blank"
                rel="noreferrer"
                className="preview-button"
              >
                Preview
              </a>
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



