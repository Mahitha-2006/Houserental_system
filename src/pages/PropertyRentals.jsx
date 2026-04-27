import React from "react";

const PropertyRentals = () => {
  const properties = [
    {
      id: 1,
      title: "2BHK Apartment in Hyderabad",
      location: "Kukatpally",
      price: "₹20,000/month",
      img: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg"
    },
    {
      id: 2,
      title: "Luxury Flat in Mumbai",
      location: "Bandra",
      price: "₹60,000/month",
      img: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg"
    },
  ];

  return (
    <div className="rent-page">
      <h1>Property Rentals</h1>
      <div className="rent-grid">
        {properties.map((p) => (
          <div key={p.id} className="rent-card">
            <img src={p.img} alt={p.title} />
            <h3>{p.title}</h3>
            <p>{p.location}</p>
            <p className="price">{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyRentals;
