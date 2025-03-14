import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProfileBubble from "../components/ProfileBubble";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/stores");

        if (response.data && response.data.length > 0) {
          console.log("✅ Stores fetched:", response.data);
          setStores(response.data);
        } else {
          console.warn("⚠️ No stores found.");
          setError("No stores available. Please add some stores first.");
        }
      } catch (error) {
        console.error("❌ Error fetching stores:", error);
        setError("Failed to load stores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return <div className="loading">Loading Stores...</div>;
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">✨ Store Dashboard ✨</h2>
        <Link to="/account">
          <ProfileBubble />
        </Link>
      </div>

      <div className="npc-buttons">
        <Link to="/npc-management" className="npc-btn">
          Manage NPCs
        </Link>
        <Link to="/npc-relationship" className="npc-btn">
          NPC Relationships
        </Link>
      </div>

      <div className="store-grid">
        {error ? (
          <p>{error}</p>
        ) : (
          stores.map((store) => {
            const routePath = `/store/${store.store_type}`;
            return (
              <Link key={store.id} to={routePath} className="store-tile">
                <div className="content">
                  <div className="front">
                    <span className="badge">{store.store_type}</span>
                    <div className="store-name">{store.name}</div>
                  </div>

                  <div className="back">
                    <div className="back-content">
                      <span style={{ fontSize: "40px" }}>🏪</span>
                      <strong>Enter Store</strong>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;
