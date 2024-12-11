'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";

function PersonalInfo() {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch personal info
    const fetchPersonalInfo = async () => {
  try {
    let token = localStorage.getItem("token");

    // Retry logic in case of token expiry
    const response = await axios.get("http://localhost:5000/personalinfo", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    setPersonalInfo(response.data.user);
  } catch (err) {
    if (err.response?.status === 401 && err.response.data.error === "Authentication failed") {
      // Handle token refresh or logout
      console.error("Token expired. Redirecting to login.");
      setError("Session expired. Please log in again.");
      localStorage.removeItem("token"); // Clear invalid token
      // Redirect to login page
    } else {
      console.error("Error fetching personal info:", err);
      setError(err.response?.data?.error || "Failed to fetch personal info");
    }
  }
};

    fetchPersonalInfo();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!personalInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Personal Info</h1>
      <p>Email: {personalInfo.email}</p>
      <p>Username: {personalInfo.username}</p>
      {/* Render more user fields as necessary */}
    </div>
  );
}

export default PersonalInfo;
