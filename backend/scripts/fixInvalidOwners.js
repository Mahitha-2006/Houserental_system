import mongoose from 'mongoose';
import Property from '../models/Property.js';

const fixInvalidOwners = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/homerental');
    
    console.log('Connected to MongoDB');
    
    // Find all properties with invalid owner
    const properties = await Property.find({});
    
    let fixedCount = 0;
    
    for (const property of properties) {
      let needsUpdate = false;
      
      // Check if owner is invalid
      if (property.owner && !mongoose.Types.ObjectId.isValid(property.owner)) {
        console.log(`Fixing property ${property._id} - Invalid owner: ${property.owner}`);
        property.owner = null;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await property.save();
        fixedCount++;
      }
    }
    
    console.log(`Fixed ${fixedCount} properties`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

fixInvalidOwners();