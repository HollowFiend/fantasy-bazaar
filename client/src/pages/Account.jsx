import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileBubble from "../components/ProfileBubble";
import "../styles/account.css";

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    profilePic: "",
    password: ""
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
        .then((res) => {
          setUser({
            id: res.data.id,
            username: res.data.username,
            email: res.data.email,
            profilePic: res.data.profile_pic,
            password: "" // Never expose passwords on the client side
          });
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user };
    if (!updatedUser.password) delete updatedUser.password; // Skip if no password is provided

    axios.put(`http://localhost:5000/api/users/${user.id}`, updatedUser)
      .then(() => {
        alert("Account details updated successfully!");
      })
      .catch((err) => console.error("Error updating user:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="account-container">
      <div className="account-header">
        <h2>Account Details</h2>
        <ProfileBubble />
      </div>

      <div className="account-form">
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <label>Profile Picture URL:</label>
        <input
          type="text"
          name="profilePic"
          value={user.profilePic}
          onChange={handleChange}
        />

        <label>New Password (optional):</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
        />

        <div className="account-buttons">
          <button onClick={handleSave} className="save-btn">Save Changes</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Account;
