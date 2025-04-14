"use client";

import { useState, useEffect } from "react";
import { FormField, FormData } from "@/types/form";

export default function Home() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [newField, setNewField] = useState<Partial<FormField>>({
    name: "",
    label: "",
    type: "text",
    required: false,
    options: [],
  });
  const [showAddField, setShowAddField] = useState(false);

  useEffect(() => {
    fetch(`https://${process.env.NEXT_PUBLIC_API_URL}/api/form-fields/`)
      // fetch("http://localhost:8000/api/form-fields/")
      .then((response) => response.json())
      .then((data) => {
        setFormFields(data);
        const initialData: FormData = {};
        data.forEach((field: FormField) => {
          initialData[field.name] = "";
        });
        setFormData(initialData);
      })
      .catch((error) => console.error("Error fetching form fields:", error));
  }, []);

  const handleInputChange = (fieldName: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleAddField = async () => {
    try {
      const response = await fetch(
        `https://${process.env.NEXT_PUBLIC_API_URL}/api/add-form-fields/`,
        // "http://localhost:8000/api/add-form-fields/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newField),
        }
      );

      if (response.ok) {
        const addedField = await response.json();
        setFormFields((prev) => [...prev, addedField]);
        setFormData((prev) => ({
          ...prev,
          [addedField.name]: "",
        }));
        setNewField({
          name: "",
          label: "",
          type: "text",
          required: false,
          options: [],
        });
        setShowAddField(false);
      } else {
        alert("Error adding field");
      }
    } catch (error) {
      console.error("Error adding field:", error);
      alert("Error adding field");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://${process.env.NEXT_PUBLIC_API_URL}/api/submit-data/`,
        // "http://localhost:8000/api/submit-data/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Data submitted successfully!");
        // Reset form data
        const initialData: FormData = {};
        formFields.forEach((field) => {
          initialData[field.name] = "";
        });
        setFormData(initialData);
      } else {
        alert("Error submitting data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="relative bg-black grid grid-rows-[20px_1fr_20px] text-black items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <main
        className={`flex flex-col gap-[32px] row-start-2 items-center sm:items-start ${
          showAddField ? "opacity-20" : ""
        }`}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Dynamic Form
          </h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex gap-10 items-center"
          >
            <div className="flex flex-col gap-5 items-center text-white">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className="space-y-2 flex items-center gap-5"
                >
                  <label className="block text-sm font-medium text-white">
                    {field.label}
                  </label>
                  {field.type === "text" && (
                    <input
                      type="text"
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required={field.required}
                    />
                  )}
                  {field.type === "number" && (
                    <input
                      type="number"
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field.name, Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required={field.required}
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required={field.required}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="w-max h-max bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                onClick={() => setShowAddField(!showAddField)}
              >
                Add Field
              </button>
            </div>
            <button
              type="submit"
              className="w-max h-max bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
      <div
        className={`${
          showAddField ? "block" : "hidden"
        } absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col gap-2 items-center bg-white px-4 pb-4 rounded-2xl`}
      >
        <button
          className="self-end text-black cursor-pointer"
          onClick={() => setShowAddField(false)}
        >
          X
        </button>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-2 items-center w-full">
            <p className="">Name</p>
            <input
              type="text"
              className="w-[200px] px-3 py-2 border border-gray-300 rounded-md text-black"
              value={newField.name}
              onChange={(e) =>
                setNewField((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-2 items-center w-full">
            <p className="">Label</p>
            <input
              type="text"
              className="w-[200px] px-3 py-2 border border-gray-300 rounded-md text-black"
              value={newField.label}
              onChange={(e) =>
                setNewField((prev) => ({ ...prev, label: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-2 items-center w-full">
            <p className="">Type</p>
            <select
              value={newField.type}
              onChange={(e) =>
                setNewField((prev) => ({
                  ...prev,
                  type: e.target.value as "text" | "number" | "select",
                }))
              }
              className="w-[100px] px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
            </select>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newField.required}
              onChange={(e) =>
                setNewField((prev) => ({ ...prev, required: e.target.checked }))
              }
              className="mr-2"
            />
            Required Field
          </label>
          {newField.type === "select" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Options (comma-separated)
              </label>
              <input
                type="text"
                value={newField.options?.join(",") || ""}
                onChange={(e) =>
                  setNewField((prev) => ({
                    ...prev,
                    options: e.target.value.split(",").map((opt) => opt.trim()),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Option 1, Option 2, Option 3"
              />
            </div>
          )}
          <button
            type="button"
            className="w-max h-max bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer"
            onClick={handleAddField}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
