import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileBubble from "../components/ProfileBubble";
import "../styles/storepage.css";

const MagicItemShop = () => {
  const [items, setItems] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ rarity: '', attunement: '', itemType: '' });

  useEffect(() => {
    const fetchMagicItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items/magic-item-shop");
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching magic items:", err);
      }
    };

    fetchMagicItems();
  }, []);

  const toggleDetails = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleQuantityChange = (index, amount) => {
    setCart((prevCart) => ({
      ...prevCart,
      [index]: Math.max(1, amount),
    }));
  };

  const addToCart = (index) => {
    alert(`${items[index].item_name} added to cart! Quantity: ${cart[index] || 1}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredItems = items.filter((item) => {
    return (
      item?.item_name?.toLowerCase().includes(search.toLowerCase()) &&
      (filters.rarity ? item.rarity === filters.rarity : true) &&
      (filters.attunement ? item.attunement === (filters.attunement === 'true') : true) &&
      (filters.itemType ? item.item_type === filters.itemType : true)
    );
  });

  return (
    <div className="page-container">
      <div className="store-header">
        <h2>Magic Item Shop</h2>
        <ProfileBubble />
      </div>

      <div className="filter-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select name="rarity" value={filters.rarity} onChange={handleFilterChange}>
          <option value="">All Rarities</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Legendary">Legendary</option>
        </select>
        <select name="attunement" value={filters.attunement} onChange={handleFilterChange}>
          <option value="">Attunement?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input
          type="text"
          name="itemType"
          placeholder="Filter by Item Type"
          value={filters.itemType}
          onChange={handleFilterChange}
        />
      </div>

      <div className="store-list">
        <table className="store-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Rarity</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Quantity</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>
                    <img
                      src={item.image || "placeholder.jpg"}
                      alt={item.item_name || "Unnamed Item"}
                      className="item-image"
                    />
                    <span className="item-name" title={item.description || "No description available"}>
                      {item.item_name || "Unnamed Item"}
                    </span>
                  </td>
                  <td>{item.rarity || "Unknown"}</td>
                  <td>{item.price || "0"} gp</td>
                  <td>{item.stock_available || 0}</td>
                  <td>
                    <input
                      type="number"
                      value={cart[index] || 1}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value) || 1)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="add-to-cart"
                      onClick={() => addToCart(index)}
                    >
                      Add
                    </button>
                  </td>
                  <td>
                    <span
                      className="toggle-icon"
                      onClick={() => toggleDetails(index)}
                    >
                      {expandedItem === index ? "▲" : "▼"}
                    </span>
                  </td>
                </tr>

                {expandedItem === index && (
                  <tr className="item-details expanded">
                    <td colSpan="7">
                      {item.details ? (
                        <>
                          {Object.entries(item.details).map(([key, value]) => (
                            <p key={key}>
                              <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong> {value || "None"}
                            </p>
                          ))}
                        </>
                      ) : (
                        <p>No additional details available.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MagicItemShop;
