import { Router } from "express";
const router = Router();
import Student from "../model/Student.js";
import Mark from "../model/Mark.js";

// Get all students with their average marks
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().lean();

    // Calculate average marks for each student
    const studentsWithAverage = await Promise.all(
      students.map(async (student) => {
        const marks = await Mark.find({ student: student._id });
        const average =
          marks.length > 0
            ? marks.reduce((sum, mark) => sum + mark.marks, 0) / marks.length
            : 0;

        return {
          ...student,
          averageMarks: Math.round(average * 100) / 100,
        };
      })
    );

    res.json(studentsWithAverage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Also delete all marks for this student
    await Mark.deleteMany({ student: req.params.id });
    res.json({ message: "Student and associated marks deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
