import React from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./NearbyServices.css";

const services = [
  {
    id: 1,
    title: "Food Delivery",
    desc: "Order from top restaurants near you",
    icon: "🍔",
    route: "/food-delivery", // Added route
  },
  {
    id: 2,
    title: "Grocery Delivery",
    desc: "Quick groceries at your doorstep",
    icon: "🛒",
    route: "/grocery-delivery", // Added route
  },
  {
    id: 3,
    title: "Medical Stores",
    desc: "Nearby pharmacies and online medicine orders",
    icon: "💊",
    route: "/medical-stores", // Added route
  },
  {
    id: 4,
    title: "Home Essentials Delivery",
    desc: "Get daily essentials such as toiletries, water cans, and supplies delivered fast",
    icon: "📦",
    route: "/home-essentials", // Added route
  },
];

const NearbyServices = () => {
  const navigate = useNavigate();

  const handleExplore = (route) => {
    navigate(route);
  };

  return (
    <div className="services-container">
      <h1 className="title">Nearby Services</h1>
      <p className="subtitle">Find useful services around your location</p>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
            <button
              className="service-btn"
              onClick={() => handleExplore(service.route)}
            >
              <MapPin size={18} /> Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyServices;
