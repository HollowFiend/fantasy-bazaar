import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileBubble from "../components/ProfileBubble";
import "../styles/storepage.css";

const GeneralStore = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items/StoreType");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching store items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading items...</div>;

  return (
    <div className="page-container">
      <div className="store-header">
        <h2>Store Name</h2>
        <ProfileBubble />
      </div>

      <div className="store-items">
        {items.map((item) => (
          <div key={item.id} className="store-item">
            <h3>{item.item_name}</h3>
            <p>{item.description}</p>
            <p>Price: {item.price} gp</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralStore;
