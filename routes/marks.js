import { Router } from "express";
import Mark from "../model/Mark.js";
const router = Router();

// Get marks for a specific student
router.get("/student/:studentId", async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.params.studentId }).populate(
      "subject",
      "name code"
    );
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add/Update marks
router.post("/", async (req, res) => {
  try {
    const { student, subject, marks } = req.body;

    const existingMark = await Mark.findOne({ student, subject });

    if (existingMark) {
      existingMark.marks = marks;
      const updatedMark = await existingMark.save();
      res.json(updatedMark);
    } else {
      const newMark = new Mark({ student, subject, marks });
      const savedMark = await newMark.save();
      res.status(201).json(savedMark);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a mark
router.delete("/:id", async (req, res) => {
  try {
    const mark = await Mark.findByIdAndDelete(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: "Mark not found" });
    }
    res.json({ message: "Mark deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
