import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    //required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deleted:{
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Note", noteSchema);
