import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileBubble from "../components/ProfileBubble";
import "../styles/npcrelationship.css";

const statusTitle = (points) => {
  if (points >= 41) return "Inseparable Bonds / Soulmates";
  if (points >= 31) return "Trusted Confidants / Deeply in Love";
  if (points >= 21) return "Close Allies / Intimate Relationship";
  if (points >= 11) return "Relationship / True Friends";
  if (points >= 1) return "Friendly";
  if (points >= -10) return "Neutral / Indifferent";
  if (points >= -20) return "Dislike / Rivalry";
  if (points >= -30) return "Antagonistic / Hostile";
  if (points >= -40) return "Enemies / Hatred";
  return "Arch-nemesis / Sworn Enemies";
};

const NpcRelationship = () => {
  const [relationships, setRelationships] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    axios.get(`http://localhost:5000/api/npc-relationships/${userId}`)
      .then((res) => setRelationships(res.data))
      .catch((err) => console.error("Error fetching relationships:", err));
  }, [userId]);

  const updateRelationship = (npcId, change) => {
    const relationship = relationships.find((r) => r.npc_id === npcId);
    if (!relationship) {
      console.error("Relationship not found for NPC ID:", npcId);
      return;
    }

    const updatedScore = Math.max(-50, Math.min(50, relationship.relationship_score + change));

    axios.put(`http://localhost:5000/api/npc-relationships/${userId}/${npcId}`, {
      relationship_score: updatedScore,
    })
      .then((res) => {
        setRelationships((prev) =>
          prev.map((rel) =>
            rel.npc_id === npcId ? { ...rel, relationship_score: res.data.relationship_score } : rel
          )
        );
      })
      .catch((err) => {
        console.error("Error updating relationship:", err);
        alert("Failed to update relationship score.");
      });
  };

  return (
    <div className="page-container">
      <div className="relationship-header">
        <h2>NPC Relationship Tracker</h2>
        <ProfileBubble />
      </div>

      <div className="npc-relationship-grid">
        {relationships.map((rel) => (
          <div key={rel.npc_id} className="npc-relationship-card">
            <h3>{rel.npc_name}</h3>
            <p><strong>Store:</strong> {rel.store_name}</p>
            <p><strong>Status:</strong> {statusTitle(rel.relationship_score)}</p>
            <p><strong>Points:</strong> {rel.relationship_score}</p>

            <div className="relationship-controls">
              <button
                onClick={() => updateRelationship(rel.npc_id, -1)}
                disabled={rel.relationship_score <= -50}>
                -1
              </button>
              <button
                onClick={() => updateRelationship(rel.npc_id, 1)}
                disabled={rel.relationship_score >= 50}>
                +1
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NpcRelationship;
