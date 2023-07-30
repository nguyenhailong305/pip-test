import React, { useEffect, useState } from "react";
import useEmployeeList from "./controller";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { supabase } from "@/utils/supabase";

export default function HomeContainer({ session }) {
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null
  );
  const {
    fetchEmployees,
    employees,
    username,
    fullName,
    avatarUrl,
    setErrorText,
    setFullName,
    setAvatarUrl,
    setUsername,
    deleteEmployee,
    addEmployee,
    resetForm,
    setIsFormOpen,
    isFormOpen,
    updateEmployee,
    status,
    sessionAuth,
    avatarFile,
    setAvatarFile,
  } = useEmployeeList();

  useEffect(() => {
    fetchEmployees();
  }, [status]);

  const handleEdit = (employee) => {
    // Fill in the form with the current employee's data
    setUsername(employee.username);
    setFullName(employee.full_name);
    setAvatarUrl(employee.avatar_url);
    setEditingEmployeeId(employee.id);
    // Open the form
    setIsFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username && fullName && avatarUrl) {
      // const filePath = `avatars/${avatarFile.name}`;
      // const { error: uploadError } = await supabase.storage
      //   .from("avatars")
      //   .upload(filePath, avatarFile);

      // if (uploadError) {
      //   console.error("Failed to upload avatar:", uploadError);
      //   return;
      // }

      // // Get the URL of the uploaded image
      // const { publicURL, error: urlError } = supabase.storage
      //   .from("avatars")
      //   .getPublicUrl(filePath);

      // if (urlError || !publicURL) {
      //   console.error("Failed to get avatar URL:", urlError);
      //   return;
      // }

      if (editingEmployeeId) {
        console.log(editingEmployeeId, "aaaaaaa");
        updateEmployee(editingEmployeeId, {
          username,
          full_name: fullName,
          avatar_url: avatarUrl,
        });
      } else {
        // Add new employee
        addEmployee({
          username,
          full_name: fullName,
          avatar_url: avatarUrl,
          created_by : sessionAuth
        });
      }
      resetForm();
    } else {
      setErrorText("Username and Full Name are required.");
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
      >
        Add User
      </button>

      <Modal
        open={isFormOpen}
        onCancel={resetForm}
        footer={null}
        title="Add new employee"
      >
        <form onSubmit={handleSubmit} className="mt-8">
          <label className="block">
            <span className="text-gray-700">Username:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            />
          </label>

          <label className="block mt-4">
            <span className="text-gray-700">Full Name:</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            />
          </label>

          {/* <label className="block mt-4">
            <span className="text-gray-700">Avatar:</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])} // Save the selected file
              className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            />
          </label> */}
          <label className="block mt-4">
            <span className="text-gray-700">Avatar :</span>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            />
          </label>

          <div className="flex justify-end">
            <button
              onClick={resetForm}
              className="mt-6  bg-slate-500 text-white font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="mt-6 ml-7 bg-blue-500 text-white font-semibold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      <h1 className="mb-12">Employee List.</h1>
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul>
          {employees.map((employee: any) => (
            <Employee
              key={employee.id}
              employee={employee}
              onDelete={() => deleteEmployee(employee.id)}
              onEdit={() => handleEdit(employee)} // Add this line
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Employee = ({ employee, onDelete, onEdit }) => {
  return (
    <li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <img
            src={employee.avatar_url}
            alt={employee.full_name}
            className="rounded-full h-12 w-12"
          />
          <div className="ml-4">
            <div className="text-sm leading-5 font-medium truncate">
              {employee.full_name}
            </div>
            <div className="text-sm leading-5 text-gray-500 truncate">
              {employee.username}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
        >
          <EditOutlined />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
        >
          <DeleteOutlined />
        </button>
      </div>
    </li>
  );
};
