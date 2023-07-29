import React, { useEffect, useState } from "react";
import useEmployeeList from "./controller";
import { Alert, Button, Input, Modal } from "antd";
import { supabase } from "@/utils/supabase";

export default function HomeContainer({ session }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [sessionAuth, setSessionAuth] = useState();

  const { employees, errorText, setErrorText, loading, addEmployee } =
    useEmployeeList({ session });

    useEffect(() => {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          const newSession = data.session;
          if (newSession && newSession.user) {
            setSessionAuth(newSession.user.id);
          }
        })
        .catch((error) => console.error(error));
    }, [session]);
  

   

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Fetch roles for current user
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", sessionAuth);


    if (rolesError) {
      console.error("Error fetching roles: ", rolesError);
      return;
    }

    const userRoles = roles.map((userRole) => userRole.role);

    // Fetch permissions for user's roles
    if ( !userRoles.includes("moderator")) {
      console.error("User is not an admin");
      return;
    }
  
    // If user is an admin, proceed with creating the employee
    const { data, error } = await supabase
      .from("employees")
      .insert([{ username, full_name: fullName, avatar_url: avatarUrl , created_by : sessionAuth }]);

    // If user has permission, proceed with creating the employee
    if (error) {
      console.error("Error adding user: ", error);
    } else {
      console.log("User added successfully: ", data);
      setUsername("");
      setFullName("");
      setAvatarUrl("");
      setIsFormOpen(false);
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

      {isFormOpen && (
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

          <label className="block mt-4">
            <span className="text-gray-700">Avatar URL:</span>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            />
          </label>

          <button
            type="submit"
            className="mt-6 bg-blue-500 text-white font-semibold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      )}
      <h1 className="mb-12">Employee List.</h1>
      {!!errorText && <Alert text={errorText} />}
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul>
          {employees.map((employee: any) => (
            <Employee
              key={employee.id}
              employee={employee}
              onDelete={() => deleteEmployee(employee.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Employee = ({ employee, onDelete }) => {
  return (
    <li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          {/* <img
            src={employee.avatar_url}
            alt={employee.full_name}
            className="rounded-full h-12 w-12"
          /> */}
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
            onDelete();
          }}
          className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};
