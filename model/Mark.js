import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student can't have duplicate marks for the same subject
markSchema.index({ student: 1, subject: 1 }, { unique: true });

const Mark = mongoose.model("Mark", markSchema);
export default Mark;
