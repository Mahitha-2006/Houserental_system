import React, { useState } from "react";

// Correct imports (case-sensitive)
import House1 from "../../../assets/images/house1.jpeg";
import House2 from "../../../assets/images/house2.jpeg";
import House3 from "../../../assets/images/house3.jpeg";

const PropertyRentals = () => {
  const [search, setSearch] = useState("");

  const properties = [
    {
      id: 1,
      name: "Modern 2BHK Apartment",
      city: "Mumbai",
      price: "₹18,000/month",
      size: "890 sq.ft",
      image: House1, // FIXED
    },
    {
      id: 2,
      name: "Luxury Villa with Garden",
      city: "Bengaluru",
      price: "₹45,000/month",
      size: "2450 sq.ft",
      image: House2, // FIXED
    },
    {
      id: 3,
      name: "Cozy 1BHK Studio",
      city: "Hyderabad",
      price: "₹12,000/month",
      size: "550 sq.ft",
      image: House3, // FIXED
    },
  ];

  // Filter search by city or name
  const filtered = properties.filter((p) =>
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>Property Rentals</h1>
      <p style={{ marginTop: "8px" }}>
        Browse beautiful homes and apartments available for rent.
      </p>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by city or property name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginTop: "20px",
          padding: "12px",
          width: "300px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginTop: "30px" }}>
        {filtered.map((property) => (
          <div
            key={property.id}
            style={{
              marginBottom: "40px",
              borderBottom: "1px solid #eee",
              paddingBottom: "30px",
              maxWidth: "400px",
            }}
          >
            <img
              src={property.image}
              alt={property.name}
              style={{ width: "100%", borderRadius: "12px" }}
            />

            <h2 style={{ marginTop: "12px" }}>{property.name}</h2>

            <p style={{ marginTop: "6px" }}>📍 {property.city}</p>
            <p style={{ marginTop: "6px" }}>{property.price}</p>
            <p style={{ marginTop: "6px" }}>🏠 Size: {property.size}</p>

            <button
              style={{
                marginTop: "12px",
                background: "#ff006e",
                color: "white",
                padding: "10px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Rent Now
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <p style={{ marginTop: "20px", color: "gray" }}>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default PropertyRentals;
