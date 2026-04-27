import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyTitle: { type: String, required: true },
  propertyImage: { type: String, required: true },
  propertyLocation: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  specialRequests: { type: String, maxLength: 500 },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);