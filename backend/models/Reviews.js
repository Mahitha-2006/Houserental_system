import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  // Reference to property being reviewed
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Property", 
    required: true 
  },
  
  // Reference to user who wrote the review
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  // User details (denormalized for easy access)
  userName: { 
    type: String, 
    required: true 
  },
  
  userImage: { 
    type: String,
    default: "https://randomuser.me/api/portraits/lego/1.jpg"
  },
  
  // Rating details
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  
  // Individual category ratings
  cleanliness: { 
    type: Number, 
    min: 1,
    max: 5,
    default: function() {
      return this.rating;
    }
  },
  
  accuracy: { 
    type: Number, 
    min: 1,
    max: 5,
    default: function() {
      return this.rating;
    }
  },
  
  communication: { 
    type: Number, 
    min: 1,
    max: 5,
    default: function() {
      return this.rating;
    }
  },
  
  location: { 
    type: Number, 
    min: 1,
    max: 5,
    default: function() {
      return this.rating;
    }
  },
  
  checkIn: { 
    type: Number, 
    min: 1,
    max: 5,
    default: function() {
      return this.rating;
    }
  },
  
  value: { 
    type: Number, 
    min: 1,
    max: 5,
    default: function() {
      return this.rating;
    }
  },
  
  // Review content
  comment: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  
  // Host response (if any)
  response: {
    comment: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  
  // Review metadata
  date: { 
    type: Date, 
    default: Date.now 
  },
  
  // Stay information
  stayDates: {
    checkIn: { type: Date },
    checkOut: { type: Date }
  },
  
  // Was this a verified stay?
  isVerified: { 
    type: Boolean, 
    default: true 
  },
  
  // Helpfulness tracking
  helpfulCount: { 
    type: Number, 
    default: 0 
  },
  
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  
  // Report tracking (for inappropriate content)
  reportedCount: { 
    type: Number, 
    default: 0 
  },
  
  reportedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  
  // Review status
  status: { 
    type: String, 
    enum: ["active", "hidden", "reported", "deleted"],
    default: "active"
  },
  
  // Photos uploaded with review
  photos: [{ 
    type: String 
  }],
  
  // Would recommend?
  wouldRecommend: { 
    type: Boolean, 
    default: true 
  },
  
  // Tags for the stay (e.g., "family", "business", "romantic")
  tags: [{ 
    type: String 
  }]
  
}, { 
  timestamps: true 
});

// Compound index to ensure one review per user per property
reviewSchema.index({ propertyId: 1, userId: 1 }, { unique: true });

// Index for finding reviews by property
reviewSchema.index({ propertyId: 1, date: -1 });
reviewSchema.index({ propertyId: 1, rating: -1 });

// Index for finding reviews by user
reviewSchema.index({ userId: 1, date: -1 });

// Index for helpfulness sorting
reviewSchema.index({ helpfulCount: -1 });

// Virtual for average rating
reviewSchema.virtual('averageRating').get(function() {
  const ratings = [
    this.cleanliness,
    this.accuracy,
    this.communication,
    this.location,
    this.checkIn,
    this.value
  ];
  
  const sum = ratings.reduce((a, b) => a + b, 0);
  return (sum / ratings.length).toFixed(1);
});

// Method to mark review as helpful
reviewSchema.methods.markHelpful = async function(userId) {
  if (!this.helpfulUsers.includes(userId)) {
    this.helpfulUsers.push(userId);
    this.helpfulCount += 1;
    await this.save();
  }
  return this;
};

// Method to report review
reviewSchema.methods.report = async function(userId, reason) {
  if (!this.reportedUsers.includes(userId)) {
    this.reportedUsers.push(userId);
    this.reportedCount += 1;
    
    // Auto-hide if reported too many times
    if (this.reportedCount >= 5) {
      this.status = "reported";
    }
    
    await this.save();
  }
  return this;
};

// Method to add host response
reviewSchema.methods.addResponse = async function(comment, hostId) {
  this.response = {
    comment,
    respondedAt: new Date(),
    respondedBy: hostId
  };
  await this.save();
  return this;
};

// Static method to get property rating summary
reviewSchema.statics.getPropertyRatingSummary = async function(propertyId) {
  const result = await this.aggregate([
    { $match: { propertyId: mongoose.Types.ObjectId(propertyId), status: "active" } },
    { 
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        cleanliness: { $avg: "$cleanliness" },
        accuracy: { $avg: "$accuracy" },
        communication: { $avg: "$communication" },
        location: { $avg: "$location" },
        checkIn: { $avg: "$checkIn" },
        value: { $avg: "$value" },
        ratingCounts: {
          $push: {
            rating: "$rating",
            count: 1
          }
        }
      }
    },
    {
      $project: {
        averageRating: { $round: ["$averageRating", 2] },
        totalReviews: 1,
        cleanliness: { $round: ["$cleanliness", 2] },
        accuracy: { $round: ["$accuracy", 2] },
        communication: { $round: ["$communication", 2] },
        location: { $round: ["$location", 2] },
        checkIn: { $round: ["$checkIn", 2] },
        value: { $round: ["$value", 2] },
        ratingDistribution: {
          $arrayToObject: {
            $map: {
              input: [1, 2, 3, 4, 5],
              as: "star",
              in: {
                k: { $toString: "$$star" },
                v: {
                  $size: {
                    $filter: {
                      input: "$ratingCounts",
                      cond: { $eq: ["$$this.rating", "$$star"] }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]);
  
  return result[0] || {
    averageRating: 0,
    totalReviews: 0,
    cleanliness: 0,
    accuracy: 0,
    communication: 0,
    location: 0,
    checkIn: 0,
    value: 0,
    ratingDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
  };
};

// Static method to get recent reviews
reviewSchema.statics.getRecentReviews = async function(propertyId, limit = 5) {
  return this.find({ 
    propertyId, 
    status: "active" 
  })
  .sort({ date: -1 })
  .limit(limit)
  .populate('userId', 'fullName email image')
  .lean();
};

// Static method to get top helpful reviews
reviewSchema.statics.getTopHelpfulReviews = async function(propertyId, limit = 3) {
  return this.find({ 
    propertyId, 
    status: "active" 
  })
  .sort({ helpfulCount: -1, date: -1 })
  .limit(limit)
  .populate('userId', 'fullName email image')
  .lean();
};

// Pre-save middleware
reviewSchema.pre('save', async function(next) {
  // Set category ratings to overall rating if not provided
  if (this.isNew) {
    if (!this.cleanliness) this.cleanliness = this.rating;
    if (!this.accuracy) this.accuracy = this.rating;
    if (!this.communication) this.communication = this.rating;
    if (!this.location) this.location = this.rating;
    if (!this.checkIn) this.checkIn = this.rating;
    if (!this.value) this.value = this.rating;
  }
  
  next();
});

// Post-save middleware to update property's review count and rating
reviewSchema.post('save', async function(doc) {
  try {
    const Property = mongoose.model('Property');
    
    // Get updated rating summary
    const summary = await mongoose.model('Review').getPropertyRatingSummary(doc.propertyId);
    
    // Update property with new review stats
    await Property.findByIdAndUpdate(doc.propertyId, {
      $inc: { reviewCount: 1 },
      rating: summary.averageRating,
      ratingBreakdown: {
        cleanliness: summary.cleanliness,
        accuracy: summary.accuracy,
        communication: summary.communication,
        location: summary.location,
        checkIn: summary.checkIn,
        value: summary.value
      }
    });
  } catch (error) {
    console.error('Error updating property stats:', error);
  }
});

// Post-remove middleware to update property when review is deleted
reviewSchema.post('remove', async function(doc) {
  try {
    const Property = mongoose.model('Property');
    
    // Get updated rating summary
    const summary = await mongoose.model('Review').getPropertyRatingSummary(doc.propertyId);
    
    // Update property with new review stats
    await Property.findByIdAndUpdate(doc.propertyId, {
      $inc: { reviewCount: -1 },
      rating: summary.averageRating,
      ratingBreakdown: {
        cleanliness: summary.cleanliness,
        accuracy: summary.accuracy,
        communication: summary.communication,
        location: summary.location,
        checkIn: summary.checkIn,
        value: summary.value
      }
    });
  } catch (error) {
    console.error('Error updating property stats:', error);
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;