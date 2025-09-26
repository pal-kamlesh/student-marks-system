import { Router } from "express";
const router = Router();
import Subject from "../model/Subject.js";
// Get all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new subject
router.post("/", async (req, res) => {
  try {
    const subject = new Subject(req.body);
    const savedSubject = await subject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
