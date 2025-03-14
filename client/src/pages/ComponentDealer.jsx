import React, { useState } from "react";
import ProfileBubble from "../components/ProfileBubble";
import "../styles/storepage.css";

// Sample component items (Replace with dynamic data later)
const componentItems = [
  {
    name: "Dragon’s Blood",
    image: "/images/dragons-blood.png",
    rarity: "Very Rare",
    price: 5000,
    stockAvailable: 1,
    attunement: "No",
    itemType: "Alchemy",
    description: "A vial of dragon’s blood, used in powerful transmutations.",
    storeType: "Component Dealer",
    currencyType: "gp",
    weight: "0.5 lb",
    spellComponents: "Alchemy, Enchanting",
    consumable: "Yes",
    specialProperties: "Highly volatile, requires careful handling.",
    harvestingMethod: "Extracted from a living or freshly slain dragon.",
    source: "Draconic creatures",
  },
  {
    name: "Phoenix Feather",
    image: "/images/phoenix-feather.png",
    rarity: "Legendary",
    price: 15000,
    stockAvailable: 1,
    attunement: "No",
    itemType: "Enchantment",
    description: "A rare feather from a Phoenix, imbued with eternal flames.",
    storeType: "Component Dealer",
    currencyType: "gp",
    weight: "0.1 lb",
    spellComponents: "Resurrection, Fire Magic",
    consumable: "No",
    specialProperties: "Glows faintly and never burns out.",
    harvestingMethod: "Collected after a Phoenix is reborn.",
    source: "Phoenix",
  },
];

// Sorting functionality
const ComponentDealer = () => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    rarity: "All",
    priceRange: "All",
    stockAvailable: "All",
    attunement: "All",
    itemType: "All",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Toggle item details visibility
  const toggleDetails = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  // Handle quantity change
  const handleQuantityChange = (index, amount) => {
    setCart((prevCart) => ({
      ...prevCart,
      [index]: Math.max(1, amount),
    }));
  };

  // Add to cart function
  const addToCart = (index) => {
    alert(`${componentItems[index].name} added to cart! Quantity: ${cart[index] || 1}`);
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...componentItems].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    }
    return 0;
  });

  // Filter items based on selected filters
  const filteredItems = sortedItems.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (filters.rarity === "All" || item.rarity === filters.rarity) &&
      (filters.priceRange === "All" ||
        (filters.priceRange === "Low" && item.price < 5000) ||
        (filters.priceRange === "Medium" && item.price >= 5000 && item.price <= 15000) ||
        (filters.priceRange === "High" && item.price > 15000)) &&
      (filters.stockAvailable === "All" ||
        (filters.stockAvailable === "In Stock" && item.stockAvailable > 0) ||
        (filters.stockAvailable === "Out of Stock" && item.stockAvailable === 0)) &&
      (filters.attunement === "All" || item.attunement === filters.attunement) &&
      (filters.itemType === "All" || item.itemType === filters.itemType)
    );
  });

  return (
    <div className="page-container">
      <div className="store-header">
        <h2>Component Dealer</h2>
        <ProfileBubble />
      </div>

      {/* Filters */}
      <div className="filter-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="filter-dropdown" onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}>
          <option value="All">All Rarities</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Very Rare">Very Rare</option>
          <option value="Legendary">Legendary</option>
        </select>

        <select className="filter-dropdown" onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}>
          <option value="All">All Prices</option>
          <option value="Low">Low (&lt;5000 gp)</option>
          <option value="Medium">Medium (5000-15000 gp)</option>
          <option value="High">High (&gt;15000 gp)</option>
        </select>
      </div>

      <div className="store-list">
        <table className="store-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("name")}>Item</th>
              <th onClick={() => requestSort("rarity")}>Rarity</th>
              <th onClick={() => requestSort("price")}>Price</th>
              <th onClick={() => requestSort("stockAvailable")}>Stock</th>
              <th>Quantity</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <>
                <tr key={index}>
                  <td>
                    <img src={item.image} alt={item.name} className="item-image" />
                    <span className="item-name" title={item.description}>{item.name}</span>
                  </td>
                  <td>{item.rarity}</td>
                  <td>{item.price} gp</td>
                  <td>{item.stockAvailable}</td>
                  <td>
                    <input
                      type="number"
                      value={cart[index] || 1}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                    />
                  </td>
                  <td>
                    <button className="add-to-cart" onClick={() => addToCart(index)}>
                      Add
                    </button>
                  </td>
                  <td>
                    <span className="toggle-icon" onClick={() => toggleDetails(index)}>
                      {expandedItem === index ? "▲" : "▼"}
                    </span>
                  </td>
                </tr>

                {expandedItem === index && (
                  <tr className="item-details expanded">
                    <td colSpan="7">
                      <p><strong>Spell Components:</strong> {item.spellComponents}</p>
                      <p><strong>Consumable:</strong> {item.consumable}</p>
                      <p><strong>Special Properties:</strong> {item.specialProperties}</p>
                      <p><strong>Harvesting Method:</strong> {item.harvestingMethod}</p>
                      <p><strong>Source:</strong> {item.source}</p>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComponentDealer;
