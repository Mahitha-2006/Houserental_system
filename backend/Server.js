// Suppress TypeScript deprecation warnings from node_modules
process.env.NODE_NO_WARNINGS = '1';

// Capture and ignore specific deprecation warnings
const originalEmitWarning = process.emitWarning;
process.emitWarning = function(warning, type, code, ...args) {
  if (typeof warning === 'string' && 
      (warning.includes('moduleResolution') || 
       warning.includes('tsconfig.json') ||
       warning.includes('rootDir'))) {
    return;
  }
  return originalEmitWarning.call(this, warning, type, code, ...args);
};

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from 'path';
import { fileURLToPath } from 'url';

// Import models
import Property from "./models/Properties.js";
import User from "./models/User.js";
import Booking from "./models/Booking.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_this_in_production';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Serve static images from assets folder
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://mahithakudaravalli04_db_user:tbteNJzFJe2wD55u@cluster2.r36tmvi.mongodb.net/rental-system?retryWrites=true&w=majority&appName=Cluster2';

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) return;
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4,
      retryWrites: true,
      maxPoolSize: 10
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isConnected = false;
    setTimeout(connectDB, 10000);
  }
};

connectDB();

mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected - attempting to reconnect...');
  isConnected = false;
  connectDB();
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  isConnected = true;
});

// Middleware to check database connection
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: "Database is connecting. Please wait a moment and try again.",
      status: "connecting"
    });
  }
  next();
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// ================ API ROUTES ================

// Health check
app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  res.json({ 
    message: "Home Rental System API",
    version: "1.0.0",
    mongodb: dbStatus[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint
app.get("/test", (req, res) => {
  res.json({ 
    message: "Server is running!", 
    timestamp: new Date().toISOString(),
    mongodbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ================ USER AUTHENTICATION ROUTES ================

// User Registration
app.post("/users/register", async (req, res) => {
  try {
    const { fullName, username, email, mobile, password } = req.body;
    
    if (!fullName || !username || !email || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already registered" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }
    
    const user = new User({
      fullName,
      username,
      email,
      mobile,
      password
    });
    
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      mobile: user.mobile
    };
    
    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      token
    });
    
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      mobile: user.mobile
    };
    
    res.json({
      message: "Login successful",
      user: userResponse,
      token
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get current user profile
app.get("/users/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
app.put("/users/update", authenticateToken, async (req, res) => {
  try {
    const { fullName, mobile } = req.body;
    const userId = req.user.userId;
    
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (mobile) updateData.mobile = mobile;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      message: "Profile updated successfully",
      user
    });
    
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================ PROPERTY ROUTES ================

// DEBUG endpoint
app.get("/debug/all-properties", checkDBConnection, async (req, res) => {
  try {
    const allProperties = await Property.find({}).lean();
    const cities = [...new Set(allProperties.map(p => p.city))];
    const cityCounts = {};
    allProperties.forEach(p => {
      cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
    });
    
    res.json({
      success: true,
      total: allProperties.length,
      cities: cities,
      cityCounts: cityCounts,
      properties: allProperties.map(p => ({ 
        id: p._id,
        title: p.title, 
        city: p.city, 
        type: p.type,
        price: p.price
      }))
    });
  } catch (err) {
    console.error("Debug endpoint error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET all properties
app.get("/properties", checkDBConnection, async (req, res) => {
  try {
    const { city, limit = 50, page = 1 } = req.query;
    let query = {};
    
    if (city) {
      if (city.toLowerCase() === 'goa') {
        query.city = { 
          $in: ["Goa", "Assagao", "Vagator", "Anjuna", "Candolim", "Calangute", 
                "Baga", "Nerul", "Saligao", "Siolim", "Mandrem", "Canacona", 
                "Siridao", "Verla Canca", "North Goa", "South Goa"]
        };
      } else if (city.toLowerCase() === 'bengaluru') {
        query.city = { 
          $in: ["Bengaluru", "Krishnagiri"]
        };
      } else {
        query.city = { $regex: new RegExp(`^${city}$`, 'i') };
      }
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [properties, total] = await Promise.all([
      Property.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Property.countDocuments(query)
    ]);
    
    res.json({
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProperties: total,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET single property by ID
app.get("/properties/:id", checkDBConnection, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id === 'city' || id === 'debug') {
      return res.status(400).json({ error: "Invalid property ID" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }
    
    const property = await Property.findById(id).lean();
    
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    Property.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).catch(err => 
      console.error('View count update error:', err)
    );
    
    res.json(property);
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================ CREATE PROPERTY ================
app.post("/properties/create", authenticateToken, async (req, res) => {
  try {
    const {
      title, description, longDescription, type, location, city, state, country,
      zipCode, address, coordinates, price, cleaningFee, serviceFee, securityDeposit,
      weeklyDiscount, monthlyDiscount, bedrooms, beds, bathrooms, guests, squareFeet,
      bedroomDetails, image, images, amenities, keyAmenities, houseRules, safetyFeatures,
      cancellationPolicy, isAvailable, instantBook, selfCheckIn, tags, categories,
      nearbyPlaces, highlights, languages
    } = req.body;

    const currentUser = req.user;
    
    const owner = {
      id: currentUser.userId,
      name: currentUser.fullName || currentUser.username,
      email: currentUser.email,
      phone: "",
      joinedSince: new Date().toISOString().split('T')[0],
      profileImage: "/assets/images/owners/default.jpg",
      bio: "Passionate host dedicated to providing exceptional stays.",
      isVerified: true,
      responseRate: 100,
      responseTime: "within an hour",
      languages: languages || ["English", "Hindi"]
    };

    const newProperty = new Property({
      title, description, longDescription: longDescription || description,
      type: type || "Apartment", location, city, state, country, zipCode, address,
      coordinates: coordinates || { lat: 0, lng: 0 }, price,
      cleaningFee: cleaningFee || 0, serviceFee: serviceFee || 0,
      securityDeposit: securityDeposit || 0, weeklyDiscount: weeklyDiscount || 0,
      monthlyDiscount: monthlyDiscount || 0, bedrooms, beds: beds || bedrooms, bathrooms, guests,
      squareFeet: squareFeet || 1000, bedroomDetails: bedroomDetails || [],
      image: image || "/assets/images/default-property.jpg",
      images: images || [image || "/assets/images/default-property.jpg"],
      rating: 0, reviewCount: 0, reviews: [],
      ratingBreakdown: { cleanliness: 0, accuracy: 0, communication: 0, location: 0, checkIn: 0, value: 0 },
      amenities: amenities || [], keyAmenities: keyAmenities || [],
      houseRules: houseRules || { checkIn: "Flexible", checkOut: "11:00 AM", minStay: 1, maxStay: 90,
        smoking: false, pets: false, parties: false, children: true,
        quietHours: { start: "22:00", end: "08:00" } },
      safetyFeatures: safetyFeatures || [], cancellationPolicy: cancellationPolicy || {
        type: "Moderate", description: "Free cancellation within 48 hours of booking.",
        fullRefundDays: 2, partialRefundDays: 1 },
      owner: owner, isSuperhost: false,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isGuestFavourite: false, isNew: true, instantBook: instantBook || false,
      selfCheckIn: selfCheckIn || true, bookedDates: [], viewCount: 0, wishlistCount: 0,
      tags: tags || [], categories: categories || ["Apartment", "Family", "Business"],
      nearbyPlaces: nearbyPlaces || [], highlights: highlights || [],
      languages: languages || ["English", "Hindi"], responseRate: 100,
      responseTime: "within an hour", virtualTour: "", videoTour: "", __v: 0
    });

    await newProperty.save();
    res.status(201).json({ success: true, message: "Property created successfully!", property: newProperty });
  } catch (err) {
    console.error("Create property error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================ DELETE PROPERTY ================
app.delete("/properties/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }
    
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    await Property.findByIdAndDelete(id);
    res.json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    console.error("Delete property error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================ UPDATE PROPERTY STATUS ================
app.patch("/properties/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid property ID format" });
    }
    
    if (!['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    
    property.status = status;
    await property.save();
    
    res.json({ success: true, property });
  } catch (err) {
    console.error("Update property status error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================ BOOKING ROUTES ================
app.post("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.user.userId });
    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/bookings/my-bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/bookings/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /                           - API Info`);
  console.log(`   GET  /test                       - Test Server`);
  console.log(`   POST /users/register             - Register new user`);
  console.log(`   POST /users/login                - Login user`);
  console.log(`   GET  /properties                 - All Properties`);
  console.log(`   POST /properties/create          - Create Property`);
  console.log(`   DELETE /properties/:id           - Delete Property`);
  console.log(`   PATCH /properties/:id/status     - Update Property Status`);
});