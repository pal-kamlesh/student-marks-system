import { Router } from "express";
import userRoute from "./user.routes.js";
import marksRoute from "./marks.js";
import studentsRoute from "./students.js";
import subjectRoute from "./subjects.js";

const router = Router();

router.use("/user", userRoute);
router.use("/students", studentsRoute);
router.use("/subjects", subjectRoute);
router.use("/marks", marksRoute);

export default router;
