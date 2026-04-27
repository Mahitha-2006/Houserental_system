import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  type: { type: String, required: true, enum: ["Apartment", "Villa", "Studio", "Heritage", "Penthouse", "House", "Condo"] },
  
  // Location
  location: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: "Telangana" },
  country: { type: String, default: "India" },
  zipCode: { type: String },
  address: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // Pricing
  price: { type: Number, required: true },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  securityDeposit: { type: Number, default: 0 },
  weeklyDiscount: { type: Number, default: 0 },
  monthlyDiscount: { type: Number, default: 0 },
  
  // Property Details
  bedrooms: { type: Number, required: true },
  beds: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  guests: { type: Number, required: true },
  squareFeet: { type: Number },
  
  // Bedroom Configuration
  bedroomDetails: [{
    roomName: { type: String },
    bedType: { type: String, enum: ["King", "Queen", "Double", "Single", "Sofa Bed", "Bunk Bed"] },
    bedCount: { type: Number }
  }],
  
  // Images
  image: { type: String, required: true },
  images: [{ type: String }],
  
  // Ratings & Reviews
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  
  // Rating Breakdown
  ratingBreakdown: {
    cleanliness: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
    checkIn: { type: Number, default: 0 },
    value: { type: Number, default: 0 }
  },
  
  // Amenities
  amenities: [{
    name: { type: String },
    category: { type: String }
  }],
  
  // Key Amenities (for quick display)
  keyAmenities: [{ type: String }],
  
  // House Rules
  houseRules: {
    checkIn: { type: String, default: "3:00 PM" },
    checkOut: { type: String, default: "11:00 AM" },
    minStay: { type: Number, default: 1 },
    maxStay: { type: Number, default: 30 },
    smoking: { type: Boolean, default: false },
    pets: { type: Boolean, default: false },
    parties: { type: Boolean, default: false },
    children: { type: Boolean, default: true },
    quietHours: {
      start: { type: String, default: "22:00" },
      end: { type: String, default: "08:00" }
    }
  },
  
  // Safety Features
  safetyFeatures: [{
    name: { type: String },
    icon: { type: String }
  }],
  
  // Cancellation Policy
  cancellationPolicy: {
    type: { type: String, enum: ["Flexible", "Moderate", "Strict", "Super Strict"] },
    description: { type: String },
    fullRefundDays: { type: Number },
    partialRefundDays: { type: Number }
  },
  
  // Host Information
  owner: { 
    id: { type: String },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    joinedSince: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    isVerified: { type: Boolean, default: true },
    responseRate: { type: Number, default: 100 },
    responseTime: { type: String, default: "within an hour" },
    languages: [{ type: String }]
  },
  isSuperhost: { type: Boolean, default: false },
  
  // Property Status
  isAvailable: { type: Boolean, default: true },
  isGuestFavourite: { type: Boolean, default: false },
  isNew: { type: Boolean, default: true },
  instantBook: { type: Boolean, default: false },
  selfCheckIn: { type: Boolean, default: false },
  
  // Booking Details
  bookedDates: [{
    startDate: { type: Date },
    endDate: { type: Date },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" }
  }],
  
  // Views & Engagement
  viewCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  
  // SEO & Discovery
  tags: [{ type: String }],
  categories: [{ type: String }],
  
  // Nearby Places
  nearbyPlaces: [{
    name: { type: String },
    type: { type: String },
    distance: { type: Number },
    duration: { type: String }
  }],
  
  // Property Highlights
  highlights: [{ type: String }],
  
  // Languages spoken by host
  languages: [{ type: String }],
  
  // Response Rate & Time
  responseRate: { type: Number, default: 100 },
  responseTime: { type: String, default: "within an hour" },
  
  // Virtual Tour URL
  virtualTour: { type: String },
  videoTour: { type: String }
  
}, { timestamps: true });

// Add indexes for better search performance
propertySchema.index({ location: "text", title: "text", description: "text" });
propertySchema.index({ city: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ rating: -1 });
propertySchema.index({ isGuestFavourite: 1 });
propertySchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });

// Virtual for calculating average rating
propertySchema.virtual('averageRating').get(function() {
  const breakdown = this.ratingBreakdown;
  const values = Object.values(breakdown);
  const sum = values.reduce((a, b) => a + b, 0);
  return values.length ? (sum / values.length).toFixed(2) : 0;
});

// Method to check if property is available for given dates
propertySchema.methods.isAvailableForDates = function(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return !this.bookedDates.some(booking => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    return (start >= bookingStart && start <= bookingEnd) ||
           (end >= bookingStart && end <= bookingEnd) ||
           (start <= bookingStart && end >= bookingEnd);
  });
};

// Method to calculate total price for stay
propertySchema.methods.calculateTotalPrice = function(nights, guests = this.guests) {
  const basePrice = this.price * nights;
  const totalFees = (this.cleaningFee || 0) + (this.serviceFee || 0);
  
  let discount = 0;
  if (nights >= 28 && this.monthlyDiscount) {
    discount = basePrice * (this.monthlyDiscount / 100);
  } else if (nights >= 7 && this.weeklyDiscount) {
    discount = basePrice * (this.weeklyDiscount / 100);
  }
  
  return {
    basePrice,
    cleaningFee: this.cleaningFee || 0,
    serviceFee: this.serviceFee || 0,
    discount,
    total: basePrice + (this.cleaningFee || 0) + (this.serviceFee || 0) - discount
  };
};

const Property = mongoose.model("Property", propertySchema);

export default Property;