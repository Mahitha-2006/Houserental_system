import React from "react";
import { useParams } from "react-router-dom";
import "./NearbyServices.css";

const serviceData = {
  food: [
    { name: "Domino's Pizza", address: "Main Road", rating: 4.4 },
    { name: "Paradise Biryani", address: "City Center", rating: 4.6 },
    { name: "Subway", address: "Metro Mall", rating: 4.2 },
  ],

  grocery: [
    { name: "Reliance Fresh", address: "Town Center", rating: 4.3 },
    { name: "More Supermarket", address: "Highway Road", rating: 4.1 },
    { name: "Local Market Store", address: "East Street", rating: 4.0 },
  ],

  essentials: [
    { name: "Daily Milk Supply", address: "Sector 5", rating: 4.5 },
    { name: "Bismi Water Can Delivery", address: "West Circle", rating: 4.3 },
    { name: "Gas Cylinder Booking", address: "Central Road", rating: 4.2 },
  ],

  medical: [
    { name: "Apollo Pharmacy", address: "City Hospital Road", rating: 4.6 },
    { name: "MedPlus", address: "Near Park Lane", rating: 4.5 },
    { name: "24/7 Medical Store", address: "Old Town", rating: 4.4 },
  ],

  laundry: [
    { name: "Urban Laundry", address: "Mall Road", rating: 4.3 },
    { name: "Fresh Clean Dry Cleaners", address: "East End", rating: 4.1 },
    { name: "Doorstep Laundry Pickup", address: "Near Station", rating: 4.2 },
  ],

  repair: [
    { name: "Electrician Services", address: "Tech Road", rating: 4.4 },
    { name: "Plumber on Call", address: "Market Lane", rating: 4.3 },
    { name: "Carpenter Fix", address: "Green Street", rating: 4.1 },
  ],

  assist: [
    { name: "Local Helper", address: "North Point", rating: 4.2 },
    { name: "Parcel Assistant", address: "Bus Stand Road", rating: 4.1 },
    { name: "Daily Task Helper", address: "Lake View", rating: 4.0 },
  ],

  emergency: [
    { name: "City Hospital", address: "Hospital Road", rating: 4.7 },
    { name: "Police Station", address: "Central Avenue", rating: 4.5 },
    { name: "Fire Station", address: "West Zone", rating: 4.4 },
  ],
};

const titles = {
  food: "Food Delivery",
  grocery: "Grocery Stores",
  essentials: "Home Essentials Delivery",
  medical: "Medical Stores",
  laundry: "Laundry & Cleaning Services",
  repair: "Home Repair Services",
  assist: "Local Assistance",
  emergency: "Emergency Services",
};

const ServiceExplore = () => {
  const { category } = useParams();
  const list = serviceData[category] || [];

  return (
    <div className="explore-container">
      <h1 className="explore-title">{titles[category]}</h1>
      <p className="explore-sub">Services available near your location</p>

      <div className="explore-list">
        {list.map((item, index) => (
          <div className="explore-card" key={index}>
            <h3>{item.name}</h3>
            <p>{item.address}</p>
            <span>⭐ {item.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceExplore;
