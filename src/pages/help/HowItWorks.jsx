import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      title: "Search",
      desc: "Find a property, car, or bike that matches your needs.",
      icon: "🔍",
    },
    {
      title: "View Details",
      desc: "Check price, photos, owner details, and availability.",
      icon: "📄",
    },
    {
      title: "Contact Owner",
      desc: "Reach out to the owner or rental provider directly.",
      icon: "📞",
    },
    {
      title: "Make Payment",
      desc: "Complete the required payment and documentation securely.",
      icon: "💳",
    },
    {
      title: "Pick Up",
      desc: "Collect your keys or vehicle and start using your rental!",
      icon: "🚗",
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
        How It Works
      </h1>

      <div style={{ marginTop: "30px" }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              marginBottom: "25px",
              padding: "20px",
              borderRadius: "10px",
              background: "#f9fafb",
              border: "1px solid #e5e5e5",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ fontSize: "36px" }}>{step.icon}</div>

            <div>
              <h3 style={{ marginBottom: "6px" }}>
                {index + 1}. {step.title}
              </h3>
              <p style={{ color: "#555", lineHeight: "1.6" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
