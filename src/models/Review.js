import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
{
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
},
{ timestamps: true }
);

// Prevent same user reviewing same book twice
reviewSchema.index({ book: 1, name: 1 }, { unique: true });

export default mongoose.models.Review ||
mongoose.model("Review", reviewSchema);