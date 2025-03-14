// NpcManagement.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProfileBubble from "../components/ProfileBubble";
import "../styles/npcmanagement.css";

const NpcManagement = () => {
  const [npcs, setNpcs] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get("http://localhost:5000/api/npcs").then((res) => setNpcs(res.data));

    if (userId) {
      axios.get(`http://localhost:5000/api/npc-relationships/${userId}`)
        .then((res) => setRelationships(res.data));
    }
  }, [userId]);

  const getRelationshipScore = (npcId) => {
    const rel = relationships.find(r => r.npc_id === npcId);
    return rel ? rel.relationship_score : 0;
  };

  return (
    <div className="page-container">
      <div className="npc-header">
        <h2>NPC Management & Relationships</h2>
        <Link to="/dashboard">
          <ProfileBubble />
        </Link>
      </div>

      <div className="npc-grid">
        {npcs.map((npc) => (
          <div key={npc.id} className="npc-card">
            <img src={npc.image || "/images/placeholder.png"} alt={npc.name} className="npc-image" />
            <h3>{npc.name}</h3>
            <p><strong>Store:</strong> {npc.store_name}</p>
            <p><strong>Description:</strong> {npc.description}</p>
            <p><strong>Relationship Points:</strong> {getRelationshipScore(npc.id)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NpcManagement;