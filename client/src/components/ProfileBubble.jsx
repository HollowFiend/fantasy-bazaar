import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner"; 
import "../styles/ProfileBubble.css";

const ProfileBubble = () => {
  const [user, setUser] = useState({
    name: "",
    profilePic: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
        .then((res) => {
          setUser({
            name: res.data.username,
            profilePic: res.data.profile_pic || "https://i.pravatar.cc/100"
          });
        })
        .catch(() => {
          setUser({
            name: "Guest",
            profilePic: "https://i.pravatar.cc/100"
          });
        })
        .finally(() => setLoading(false));
    } else {
      setUser({
        name: "Guest",
        profilePic: "https://i.pravatar.cc/100"
      });
      setLoading(false);
    }
  }, []);

  return (
    <div className="profile-bubble">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <img src={user.profilePic} alt="User Profile" />
          <span>{user.name}</span>
        </>
      )}
    </div>
  );
};

export default ProfileBubble;
