import React, { useState } from "react";
import "./CreateListing.css";

const CreateListing = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    image: "",
    description: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    furnishing: "",
    amenities: "",
    contact: "",
    availableFrom: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🚀 UPDATED SUBMIT FUNCTION - Real API call to your Railway backend
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Map your form fields to backend Property schema
    const propertyData = {
      title: form.title,
      rent: form.price, // "price" → "rent"
      location: form.location,
      img: form.image, // "image" → "img"
      description: form.description,
      bedrooms: parseInt(form.bedrooms) || 1,
      area: `${form.sqft} sq ft`, // Format for backend
      furnished: form.furnishing === "Fully Furnished" ? "Furnished" : 
                form.furnishing === "Semi Furnished" ? "Semi-Furnished" : "Unfurnished",
      status: "Available"
    };

    try {
      // 🔥 PROXIED API CALL (works with your vite.config.js proxy)
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save property");
      }

      const savedProperty = await response.json();
      setMessage(`✅ Property listed successfully! ID: ${savedProperty._id}`);
      console.log("✅ Saved property:", savedProperty);
      
      // Reset form
      setForm({
        title: "",
        price: "",
        location: "",
        image: "",
        description: "",
        type: "",
        bedrooms: "",
        bathrooms: "",
        sqft: "",
        furnishing: "",
        amenities: "",
        contact: "",
        availableFrom: "",
      });

    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h1>List Your Property</h1>

      {message && (
        <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <form className="create-form" onSubmit={submit}>
        {/* Basic info */}
        <input name="title" value={form.title} onChange={handle} placeholder="Property Title" required />
        <input name="price" value={form.price} onChange={handle} placeholder="Price per month (₹)" required />
        <input name="location" value={form.location} onChange={handle} placeholder="Location" required />
        <input name="image" value={form.image} onChange={handle} placeholder="Image URL" />

        {/* Property details */}
        <select name="type" value={form.type} onChange={handle} required>
          <option value="">Select Property Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Studio">Studio</option>
          <option value="Independent House">Independent House</option>
          <option value="PG/Hostel">PG/Hostel</option>
        </select>

        <input name="bedrooms" value={form.bedrooms} onChange={handle} placeholder="Bedrooms (e.g., 2)" required />
        <input name="bathrooms" value={form.bathrooms} onChange={handle} placeholder="Bathrooms (e.g., 2)" />
        <input name="sqft" value={form.sqft} onChange={handle} placeholder="Sqft (e.g., 1200)" required />

        <select name="furnishing" value={form.furnishing} onChange={handle} required>
          <option value="">Furnishing</option>
          <option value="Fully Furnished">Fully Furnished</option>
          <option value="Semi Furnished">Semi Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>

        <input
          name="amenities"
          value={form.amenities}
          onChange={handle}
          placeholder="Amenities (comma separated)"
        />

        {/* Contact & Availability */}
        <input
          name="contact"
          value={form.contact}
          onChange={handle}
          placeholder="Contact Number"
          required
        />

        <input
          type="date"
          name="availableFrom"
          value={form.availableFrom}
          onChange={handle}
          placeholder="Available From"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handle}
          placeholder="Short description"
          required
        />

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "📤 Listing..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
