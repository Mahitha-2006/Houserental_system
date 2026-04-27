// backend/routes/properties.js
import express from 'express';
import mongoose from 'mongoose';
import Property from '../models/Property.js';

const router = express.Router();

// GET /properties - Get all properties with filtering
router.get('/', async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, bedrooms, guests, sort } = req.query;
    
    let query = {};
    
    // Apply filters
    if (city) {
      query.city = { $regex: new RegExp(city, 'i') };
    }
    if (type) {
      query.type = type;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (bedrooms) {
      query.bedrooms = { $gte: parseInt(bedrooms) };
    }
    if (guests) {
      query.guests = { $gte: parseInt(guests) };
    }
    
    // Apply sorting
    let sortOption = {};
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else sortOption = { createdAt: -1 };
    
    const properties = await Property.find(query)
      .sort(sortOption)
      .populate('owner', 'name')
      .lean();
    
    // Process properties to handle invalid owners
    const processedProperties = properties.map(prop => {
      if (!prop.owner || typeof prop.owner === 'string') {
        prop.owner = { name: 'Superhost' };
      }
      return prop;
    });
    
    res.json(processedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /properties/:id - Get single property
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by _id first
    let property = null;
    
    // Check if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      property = await Property.findById(id).populate('owner', 'name email image').lean();
    }
    
    // If not found by _id, try to find by string id
    if (!property) {
      property = await Property.findOne({ _id: id }).populate('owner', 'name email image').lean();
    }
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Handle invalid owner - provide default if owner is invalid
    if (!property.owner || typeof property.owner === 'string') {
      property.owner = {
        name: 'Superhost',
        email: 'superhost@example.com',
        image: 'https://via.placeholder.com/100',
        _id: null
      };
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    
    // Handle CastError specifically
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid property ID format' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /properties - Create new property
router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /properties/:id - Update property
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }
    
    const property = await Property.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /properties/:id - Delete property
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }
    
    const property = await Property.findByIdAndDelete(id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;