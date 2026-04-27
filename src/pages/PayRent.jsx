import React, { useState } from "react";
import "./PayRent.css";

const PayRent = () => {
  const [form, setForm] = useState({
    tenantName: "",
    ownerName: "",
    propertyAddress: "",
    rentAmount: "",
    month: "",
    paymentMethod: "",
    upiId: "",
    phonePayNumber: "",
    gpayNumber: "",
    paytmNumber: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    alert("Rent Payment Submitted Successfully!");
    console.log("Rent Payment:", form);
  };

  return (
    <div className="payrent-container">
      <h1>Pay Your Rent</h1>

      <form className="payrent-form" onSubmit={submit}>

        <input
          name="tenantName"
          placeholder="Tenant Name"
          value={form.tenantName}
          onChange={handleChange}
          required
        />

        <input
          name="ownerName"
          placeholder="House Owner Name"
          value={form.ownerName}
          onChange={handleChange}
          required
        />

        <input
          name="propertyAddress"
          placeholder="Property Address"
          value={form.propertyAddress}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="rentAmount"
          placeholder="Rent Amount (₹)"
          value={form.rentAmount}
          onChange={handleChange}
          required
        />

        <select
          name="month"
          value={form.month}
          onChange={handleChange}
          required
        >
          <option value="">Select Month</option>
          {[
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December",
          ].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Payment Method</option>
          <option value="gpay">Google Pay</option>
          <option value="phonepe">PhonePe</option>
          <option value="paytm">Paytm</option>
          <option value="upi">Other UPI</option>
          <option value="card">Debit/Credit Card</option>
        </select>

        {/* ✅ Google Pay */}
        {form.paymentMethod === "gpay" && (
          <input
            name="gpayNumber"
            placeholder="Google Pay Number"
            value={form.gpayNumber}
            onChange={handleChange}
            required
          />
        )}

        {/* ✅ PhonePe */}
        {form.paymentMethod === "phonepe" && (
          <input
            name="phonePayNumber"
            placeholder="PhonePe Number"
            value={form.phonePayNumber}
            onChange={handleChange}
            required
          />
        )}

        {/* ✅ Paytm */}
        {form.paymentMethod === "paytm" && (
          <input
            name="paytmNumber"
            placeholder="Paytm Number"
            value={form.paytmNumber}
            onChange={handleChange}
            required
          />
        )}

        {/* ✅ Other UPI */}
        {form.paymentMethod === "upi" && (
          <input
            name="upiId"
            placeholder="UPI ID (example: name@upi)"
            value={form.upiId}
            onChange={handleChange}
            required
          />
        )}

        {/* ✅ Card Payment */}
        {form.paymentMethod === "card" && (
          <>
            <input
              name="cardNumber"
              placeholder="Card Number"
              value={form.cardNumber}
              onChange={handleChange}
              required
            />
            <input
              name="expiry"
              placeholder="Expiry Date (MM/YY)"
              value={form.expiry}
              onChange={handleChange}
              required
            />
            <input
              name="cvv"
              placeholder="CVV"
              value={form.cvv}
              onChange={handleChange}
              required
            />
          </>
        )}

        <textarea
          name="notes"
          placeholder="Additional Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />

        <button type="submit" className="pay-btn">Submit Payment</button>
      </form>
    </div>
  );
};

export default PayRent;
