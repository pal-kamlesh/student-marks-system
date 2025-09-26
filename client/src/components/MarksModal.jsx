/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const MarksModal = ({ student, isOpen, onClose, onMarksUpdated }) => {
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [newMark, setNewMark] = useState({ subject: "", marks: "" });

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
      fetchMarks();
    }
  }, [isOpen, student]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("/api/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchMarks = async () => {
    try {
      const response = await axios.get(`/api/marks/student/${student._id}`);
      setMarks(response.data);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const handleAddMark = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/marks", {
        student: student._id,
        subject: newMark.subject,
        marks: parseInt(newMark.marks),
      });
      setNewMark({ subject: "", marks: "" });
      fetchMarks();
      onMarksUpdated();
    } catch (error) {
      alert("Error adding marks: " + error.response.data.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Marks for {student.name}</h2>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Current Marks:</h3>
          {marks.length === 0 ? (
            <p className="text-gray-500">No marks added yet</p>
          ) : (
            <ul className="space-y-1">
              {marks.map((mark) => (
                <li key={mark._id} className="flex justify-between">
                  <span>{mark.subject.name}</span>
                  <span>{mark.marks}/100</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleAddMark} className="space-y-3">
          <select
            value={newMark.subject}
            onChange={(e) =>
              setNewMark({ ...newMark, subject: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="Marks (0-100)"
            value={newMark.marks}
            onChange={(e) => setNewMark({ ...newMark, marks: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Add/Update Marks
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MarksModal;
