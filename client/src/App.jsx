import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentForm from "./components/StudentForm.jsx";
import StudentTable from "./components/StudentTable.jsx";
import MarksModal from "./components/MarksModal.jsx";

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMarksModal, setShowMarksModal] = useState(false);

  useEffect(() => {
    fetchStudents();
    initializeSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const initializeSubjects = async () => {
    try {
      const subjects = [
        { name: "Mathematics", code: "MATH101" },
        { name: "Physics", code: "PHY101" },
        { name: "Chemistry", code: "CHEM101" },
        { name: "English", code: "ENG101" },
        { name: "Computer Science", code: "CS101" },
      ];
      for (const subject of subjects) {
        try {
          await axios.post("http://localhost:5000/api/subjects", subject);
        } catch (error) {
          // Subject might already exist, ignore error
        }
      }
    } catch (error) {
      console.error("Error initializing subjects:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents();
      } catch (error) {
        alert("Error deleting student");
      }
    }
  };

  const handleViewMarks = (student) => {
    setSelectedStudent(student);
    setShowMarksModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Student Marks Management System
        </h1>

        <StudentForm
          onStudentAdded={fetchStudents}
          editingStudent={editingStudent}
          onEditComplete={() => setEditingStudent(null)}
        />

        <StudentTable
          students={students}
          onEdit={setEditingStudent}
          onDelete={handleDelete}
          onViewMarks={handleViewMarks}
        />

        <MarksModal
          student={selectedStudent}
          isOpen={showMarksModal}
          onClose={() => setShowMarksModal(false)}
          onMarksUpdated={fetchStudents}
        />
      </div>
    </div>
  );
}

export default App;
