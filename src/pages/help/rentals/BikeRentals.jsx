import React, { useState } from "react";

// IMPORT IMAGES
import classic350 from "../../../assets/images/classic350.jpeg";
import activa from "../../../assets/images/activa.jpeg";
import himalayan from "../../../assets/images/himalayan.jpeg";

// =========================================
// EMBEDDED STYLES - Based on your navbar colors
// =========================================
const styles = `
/* ---------- RESET & BASE ---------- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #333;
  line-height: 1.5;
  background-color: #f8f9fa;
}

/* ---------- COLOR VARIABLES ---------- */
:root {
  --primary: #ff385c;
  --primary-hover: #e32f51;
  --secondary: #007bff;
  --secondary-hover: #0067d4;
  --success: #34c759;
  --success-hover: #28a745;
  --text-dark: #333;
  --text-light: #666;
  --white: #ffffff;
  --border-light: rgba(0,0,0,0.06);
  --shadow-sm: 0px 4px 12px rgba(0,0,0,0.12);
  --shadow-hover: 0 8px 20px rgba(0,0,0,0.15);
  --bg-hover: #f7f7f7;
}

/* ---------- TYPOGRAPHY ---------- */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

p {
  margin-bottom: 1rem;
  color: var(--text-light);
}

/* ---------- LAYOUT ---------- */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section {
  padding: 60px 0;
}

.section-light {
  background-color: var(--white);
}

/* ---------- CARD GRID ---------- */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.card-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-dark);
}

.card-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  margin: 10px 0;
}

/* ---------- FORM ELEMENTS ---------- */
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(255,56,92,0.1);
}

/* ---------- BUTTONS ---------- */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

/* ---------- ALERTS ---------- */
.alert {
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

/* ---------- UTILITIES ---------- */
.text-center { text-align: center; }
.mb-4 { margin-bottom: 2rem; }
.mt-4 { margin-top: 2rem; }

/* ---------- ANIMATIONS ---------- */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 760px) {
  h1 { font-size: 2rem; }
  h2 { font-size: 1.5rem; }
  
  .section {
    padding: 40px 0;
  }

  .card-grid {
    grid-template-columns: 1fr;
    padding: 0 16px;
  }
}
`;

const bikes = [
  {
    id: 1,
    name: "Royal Enfield Classic 350",
    image: classic350,
    location: "Mumbai",
    price: "₹1,200/day",
    mileage: "35 kmpl"
  },
  {
    id: 2,
    name: "Honda Activa 6G",
    image: activa,
    location: "Bengaluru",
    price: "₹500/day",
    mileage: "45 kmpl"
  },
  {
    id: 3,
    name: "Royal Enfield Himalayan",
    image: himalayan,
    location: "Delhi",
    price: "₹2,000/day",
    mileage: "30 kmpl"
  },
  //   {
  //     id: 4,
  //     name: "TVS Ntorq 125",
  //     image: ntorq,
  //     location: "Hyderabad",
  //     price: "₹600/day",
  //     mileage: "47 kmpl"
  //   },
  //   {
  //     id: 5,
  //     name: "Yamaha MT 15",
  //     image: mt15,
  //     location: "Chennai",
  //     price: "₹1,000/day",
  //     mileage: "40 kmpl"
  //   },
];

function BikeRentals() {
  const [search, setSearch] = useState("");

  const filteredBikes = bikes.filter((bike) =>
    bike.location.toLowerCase().includes(search.toLowerCase()) ||
    bike.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Inject the styles */}
      <style>{styles}</style>
      
      {/* Main container with proper classes */}
      <div className="section section-light">
        <div className="container">
          {/* Header Section */}
          <div className="text-center mb-4">
            <h1>🏍️ Bike Rentals</h1>
            <p className="mb-4">Choose from a wide range of bikes for your trip or daily use.</p>
          </div>

          {/* Search Bar */}
          <div className="text-center mb-4">
            <input
              type="text"
              placeholder="Search by location or bike name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ maxWidth: "400px", margin: "0 auto" }}
            />
          </div>

          {/* Bike Grid */}
          <div className="card-grid">
            {filteredBikes.map((bike) => (
              <div key={bike.id} className="card fade-in">
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="card-image"
                />
                
                <div className="card-content">
                  <h3 className="card-title">{bike.name}</h3>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <p style={{ marginBottom: "5px" }}>
                      <span style={{ fontSize: "1.2rem", marginRight: "5px" }}>📍</span> 
                      {bike.location}
                    </p>
                    <p style={{ marginBottom: "5px" }}>
                      <span style={{ fontSize: "1.2rem", marginRight: "5px" }}>⛽</span> 
                      Mileage: {bike.mileage}
                    </p>
                    <p className="card-price">{bike.price}</p>
                  </div>

                  <button className="btn btn-primary" style={{ width: "100%" }}>
                    Rent Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredBikes.length === 0 && (
            <div className="alert alert-info text-center" style={{ maxWidth: "400px", margin: "20px auto" }}>
              <p style={{ margin: 0, color: "#0c5460" }}>
                No bikes found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BikeRentals;