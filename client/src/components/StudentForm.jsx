/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";

const StudentForm = ({ onStudentAdded, editingStudent, onEditComplete }) => {
  const [formData, setFormData] = useState({
    name: editingStudent?.name || "",
    email: editingStudent?.email || "",
    rollNumber: editingStudent?.rollNumber || "",
  });

  React.useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name,
        email: editingStudent.email,
        rollNumber: editingStudent.rollNumber,
      });
    }
  }, [editingStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(`/api/students/${editingStudent._id}`, formData);
        onEditComplete();
      } else {
        await axios.post("/api/students", formData);
      }
      setFormData({ name: "", email: "", rollNumber: "" });
      onStudentAdded();
    } catch (error) {
      alert("Error: " + error.response.data.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">
        {editingStudent ? "Edit Student" : "Add New Student"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Student Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={(e) =>
              setFormData({ ...formData, rollNumber: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingStudent ? "Update Student" : "Add Student"}
          </button>
          {editingStudent && (
            <button
              type="button"
              onClick={() => {
                onEditComplete();
                setFormData({ name: "", email: "", rollNumber: "" });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
