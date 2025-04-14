"use client";

import { FormField } from "@/types/form";
import { useEffect, useState } from "react";

interface FormData {
  id: string;
  data: {
    [key: string]: string;
  };
}

export default function AdminPage() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<FormData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = () => {
    setLoading(true);
    // Fetch form fields
    fetch(`https://${process.env.NEXT_PUBLIC_API_URL}/api/form-fields/`)
      // fetch("http://localhost:8000/api/form-fields/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((fields) => {
        setFormFields(fields);
        // After getting fields, fetch form data
        // return fetch("http://localhost:8000/api/form-data/");
        return fetch(
          `https://${process.env.NEXT_PUBLIC_API_URL}/api/form-data/`
        );
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Ensure each submission has an ID
        setFormData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const response = await fetch(
        // `http://localhost:8000/api/form-data/${id}/`,
        `https://${process.env.NEXT_PUBLIC_API_URL}/api/form-data/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      // Refresh the data after successful deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting submission:", error);
      setError("Failed to delete submission");
    }
  };

  const handleEdit = (submission: FormData) => {
    setEditingSubmission(submission);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubmission) return;
    try {
      const response = await fetch(
        // `http://localhost:8000/api/form-data/${editingSubmission.id}/`,
        `https://${process.env.NEXT_PUBLIC_API_URL}/api/form-data/${editingSubmission.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingSubmission),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update submission");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating submission:", error);
      setError("Failed to update submission");
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    if (editingSubmission) {
      setEditingSubmission({
        ...editingSubmission,
        data: {
          ...editingSubmission.data,
          [fieldName]: value,
        },
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 text-black bg-black">
      <h1 className="text-2xl font-bold mb-4 text-white">Form Submissions</h1>
      {formData.length === 0 ? (
        <p>No form submissions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                {/* <th className="px-4 py-2 border">ID</th> */}
                {formFields.map((field) => (
                  <th key={field.name} className="px-4 py-2 border">
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((submission, index) => (
                <tr
                  key={submission.id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  {/* <td className="px-4 py-2 border">{submission.id}</td> */}
                  {formFields.map((field) => (
                    <td key={field.name} className="px-4 py-2 border">
                      {submission.data[field.name] || "-"}
                    </td>
                  ))}
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(submission)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Submission</h2>
            <form onSubmit={handleUpdate}>
              {formFields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={editingSubmission.data[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
