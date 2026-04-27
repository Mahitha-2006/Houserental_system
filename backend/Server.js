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

// Import models
import Property from "./models/Properties.js";
import User from "./models/User.js";
import Booking from "./models/Booking.js";

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
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://mahithakudaravalli04_db_user:tbteNJzFJe2wD55u@cluster2.r36tmvi.mongodb.net/rental-system?retryWrites=true&w=majority&appName=Cluster2';

// Connection function with retry logic
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
    console.log(`📊 Database: ${MONGODB_URI.substring(0, 50)}...`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isConnected = false;
    console.log('Retrying connection in 10 seconds...');
    setTimeout(connectDB, 10000);
  }
};

// Initial connection
connectDB();

// Monitor connection
mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected - attempting to reconnect...');
  isConnected = false;
  connectDB();
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
  isConnected = true;
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
    
    // Validate required fields
    if (!fullName || !username || !email || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Check if user already exists
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
    
    // Create new user
    const user = new User({
      fullName,
      username,
      email,
      mobile,
      password
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info without password
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
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info without password
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

// Get current user profile (protected route)
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
    console.log("🔍 Debug endpoint called");
    
    const allProperties = await Property.find({}).lean();
    console.log(`Found ${allProperties.length} total properties`);
    
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
        price: p.price,
        rating: p.rating,
        bedrooms: p.bedrooms
      }))
    });
  } catch (err) {
    console.error("Debug endpoint error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// GET all properties
app.get("/properties", checkDBConnection, async (req, res) => {
  try {
    const { 
      city, 
      minPrice, 
      maxPrice, 
      bedrooms, 
      type,
      limit = 50,
      page = 1,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;
    
    let query = {};
    
    if (city) {
      if (city.toLowerCase() === 'goa') {
        query.city = { 
          $in: ["Goa", "Assagao", "Vagator", "Anjuna", "Candolim", "Calangute", 
                "Baga", "Nerul", "Saligao", "Siolim", "Mandrem", "Canacona", 
                "Siridao", "Verla Canca", "North Goa", "South Goa"]
        };
      } else if (city.toLowerCase() === 'mumbai') {
        query.city = { 
          $in: ["Mumbai", "Navi Mumbai", "Panvel", "Alibaug", "Mumbai Suburban"]
        };
      } else if (city.toLowerCase() === 'bengaluru') {
        query.city = { 
          $in: ["Bengaluru", "Krishnagiri"]
        };
      } else if (city.toLowerCase() === 'mysore') {
        query.city = { 
          $in: [
            "Mysore", "Mysuru", "Siddapura", "Siddapur", "Coorg", "Kodagu",
            "Jettihundi", "Kalalavadi", "Basavanahalli", "Kutta", "Madikeri",
            "Kushalnagar", "Virajpet", "Somwarpet", "Gonikoppal",
            "Kannur"
          ]
        };
      } else if (city.toLowerCase() === 'vizag') {
        query.city = { 
          $in: ["Visakhapatnam", "Vizag", "Bheemili", "Kapuluppada", "Madhurawada"]
        };
      } else {
        query.city = { $regex: new RegExp(`^${city}$`, 'i') };
      }
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    if (bedrooms) {
      query.bedrooms = { $gte: parseInt(bedrooms) };
    }
    
    if (type) {
      query.type = type;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Property.countDocuments(query)
    ]);
    
    console.log(`📦 Fetched ${properties.length} properties for ${city || 'all'} (total: ${total})`);
    
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

// GET properties by city
app.get("/properties/city/:city", checkDBConnection, async (req, res) => {
  try {
    const { city } = req.params;
    const { 
      minPrice, 
      maxPrice, 
      bedrooms, 
      type,
      limit = 50,
      page = 1,
      sortBy = 'rating',
      order = 'desc'
    } = req.query;
    
    let query = {};
    
    if (city.toLowerCase() === 'goa') {
      query.city = { 
        $in: ["Goa", "Assagao", "Vagator", "Anjuna", "Candolim", "Calangute", 
              "Baga", "Nerul", "Saligao", "Siolim", "Mandrem", "Canacona", 
              "Siridao", "Verla Canca", "North Goa", "South Goa"]
      };
    }
    else if (city.toLowerCase() === 'mumbai') {
      query.city = { 
        $in: ["Mumbai", "Navi Mumbai", "Panvel", "Alibaug", "Mumbai Suburban"]
      };
    }
    else if (city.toLowerCase() === 'bengaluru') {
      query.city = { 
        $in: ["Bengaluru", "Krishnagiri"]
      };
    }
    else if (city.toLowerCase() === 'mysore') {
      query.city = { 
        $in: [
          "Mysore", "Mysuru", "Siddapura", "Siddapur", "Coorg", "Kodagu",
          "Jettihundi", "Kalalavadi", "Basavanahalli", "Kutta", "Madikeri",
          "Kushalnagar", "Virajpet", "Somwarpet", "Gonikoppal",
          "Kannur"
        ]
      };
    }
    else if (city.toLowerCase() === 'vizag') {
      query.city = { 
        $in: ["Visakhapatnam", "Vizag", "Bheemili", "Kapuluppada", "Madhurawada"]
      };
    }
    else {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    if (bedrooms) {
      query.bedrooms = { $gte: parseInt(bedrooms) };
    }
    
    if (type) {
      query.type = type;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    
    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Property.countDocuments(query)
    ]);
    
    console.log(`📦 Fetched ${properties.length} properties for city: ${city} (total in DB: ${total})`);
    
    res.json({
      city,
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProperties: total,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Error fetching properties by city:", err);
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

// GET all cities with counts
app.get("/cities", checkDBConnection, async (req, res) => {
  try {
    const cities = await Property.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(cities);
  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET property types for a city
app.get("/cities/:city/types", checkDBConnection, async (req, res) => {
  try {
    const { city } = req.params;
    
    let query = {};
    
    if (city.toLowerCase() === 'goa') {
      query.city = { 
        $in: ["Goa", "Assagao", "Vagator", "Anjuna", "Candolim", "Calangute", 
              "Baga", "Nerul", "Saligao", "Siolim", "Mandrem", "Canacona", 
              "Siridao", "Verla Canca", "North Goa", "South Goa"]
      };
    } else if (city.toLowerCase() === 'mumbai') {
      query.city = { 
        $in: ["Mumbai", "Navi Mumbai", "Panvel", "Alibaug", "Mumbai Suburban"]
      };
    } else if (city.toLowerCase() === 'bengaluru') {
      query.city = { 
        $in: ["Bengaluru", "Krishnagiri"]
      };
    } else if (city.toLowerCase() === 'mysore') {
      query.city = { 
        $in: [
          "Mysore", "Mysuru", "Siddapura", "Siddapur", "Coorg", "Kodagu",
          "Jettihundi", "Kalalavadi", "Basavanahalli", "Kutta", "Madikeri",
          "Kushalnagar", "Virajpet", "Somwarpet", "Gonikoppal",
          "Kannur"
        ]
      };
    } else if (city.toLowerCase() === 'vizag') {
      query.city = { 
        $in: ["Visakhapatnam", "Vizag", "Bheemili", "Kapuluppada", "Madhurawada"]
      };
    } else {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }
    
    const types = await Property.aggregate([
      { $match: query },
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);
    
    res.json(types);
  } catch (err) {
    console.error("Error fetching property types:", err);
    res.status(500).json({ error: err.message });
  }
});
// ================ BOOKING ROUTES ================

// Create a new booking
app.post("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const {
      propertyId, propertyTitle, propertyImage, propertyLocation,
      checkIn, checkOut, guests, bedrooms, bathrooms,
      pricePerNight, totalPrice, cleaningFee, serviceFee,
      paymentMethod, specialRequests, guestName, guestEmail, guestPhone
    } = req.body;

    const booking = new Booking({
      propertyId,
      userId: req.user.userId,
      propertyTitle,
      propertyImage,
      propertyLocation,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      bedrooms,
      bathrooms,
      pricePerNight,
      totalPrice,
      cleaningFee: cleaningFee || 0,
      serviceFee: serviceFee || 0,
      paymentMethod,
      specialRequests: specialRequests || '',
      guestName,
      guestEmail,
      guestPhone,
      status: 'confirmed',
      paymentStatus: 'completed'
    });

    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user's bookings
app.get("/api/bookings/my-bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel a booking
app.put("/api/bookings/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
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
  res.status(404).json({ 
    error: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: [
      "GET  /",
      "GET  /test",
      "POST /users/register",
      "POST /users/login",
      "GET  /users/me",
      "PUT  /users/update",
      "GET  /debug/all-properties",
      "GET  /properties",
      "GET  /properties/:id",
      "GET  /properties/city/:city",
      "GET  /cities",
      "GET  /cities/:city/types"
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n📝 Available endpoints:`);
  console.log(`   GET  /                           - API Info`);
  console.log(`   GET  /test                       - Test Server`);
  console.log(`\n   🔐 User Authentication Routes:`);
  console.log(`   POST /users/register             - Register new user`);
  console.log(`   POST /users/login                - Login user`);
  console.log(`   GET  /users/me                   - Get current user (Protected)`);
  console.log(`   PUT  /users/update               - Update profile (Protected)`);
  console.log(`\n   🏠 Property Routes:`);
  console.log(`   GET  /debug/all-properties       - Debug all properties`);
  console.log(`   GET  /properties                 - All Properties`);
  console.log(`   GET  /properties/:id             - Single Property`);
  console.log(`   GET  /properties/city/:city      - Properties by City`);
  console.log(`   GET  /cities                     - All Cities with counts`);
  console.log(`   GET  /cities/:city/types         - Property types for city`);
});