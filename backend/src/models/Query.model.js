import mongoose from 'mongoose';

const querySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the query'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
    },
    category: {
      type: String,
      enum: ['Technical', 'Billing', 'Account', 'General'],
      required: [true, 'Please select a category'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model('Query', querySchema);
export default Query;