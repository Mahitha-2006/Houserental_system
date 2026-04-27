import React from "react";

const HelpFAQ = () => {
  const faqs = [
    {
      q: "How do I rent a property?",
      a: "You can browse available listings, check details, and contact the owner directly through the platform.",
    },
    {
      q: "Are vehicle rentals available 24/7?",
      a: "Yes. However, pick-up and drop timings may vary depending on the vendor.",
    },
    {
      q: "What documents are required?",
      a: "You need ID proof, address proof, and a valid driving license for vehicle rentals.",
    },
    {
      q: "Is there any booking fee?",
      a: "Some listings may include a small service or booking fee, depending on the owner.",
    },
    {
      q: "How do I cancel a booking?",
      a: "You can cancel from the bookings section. Cancellation policies depend on the vendor.",
    },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Help & FAQ
      </h1>

      {faqs.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "25px",
            padding: "20px",
            borderRadius: "10px",
            background: "#f8f8f8",
            border: "1px solid #e5e5e5",
          }}
        >
          <h3 style={{ marginBottom: "8px" }}>
            {index + 1}. {item.q}
          </h3>
          <p style={{ color: "#555", lineHeight: "1.6" }}>{item.a}</p>
        </div>
      ))}
    </div>
  );
};

export default HelpFAQ;
