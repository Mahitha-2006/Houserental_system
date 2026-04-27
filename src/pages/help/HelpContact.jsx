import React from "react";
import "./Help.css"; // if you have a help css file

const HelpContact = () => {
  return (
    <div className="help-page">
      <h1>Contact Support</h1>

      <div className="help-box">
        <h3>Need Help?</h3>
        <p>
          If you need any assistance, feel free to contact me anytime.
          <br />
          <strong>📞 Mobile: 9550499216</strong>
        </p>

        <p>You can message this number on WhatsApp or SMS.</p>

        <div className="info">
          We will get back to you as soon as possible.
        </div>
      </div>
    </div>
  );
};

export default HelpContact;
