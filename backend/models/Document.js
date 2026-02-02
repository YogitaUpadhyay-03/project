import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  title: String,
  content: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Document", DocumentSchema);
