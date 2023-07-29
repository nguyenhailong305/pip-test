import React, { useEffect, useState } from "react";
import useEmployeeList from "./controller";
import { Alert, Button, Input, Modal } from "antd";
import { supabase } from "@/utils/supabase";
import { fetchUserRoles } from "@/hooks/useUser";

export default function HomeContainer({ session }) {
  const [visible, setVisible] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState(null);

  const {
    employees,
    errorText,
    setErrorText,
    deleteEmployee,
    loading,
    addEmployee,
  } = useEmployeeList({ session });

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const { data, error } = await supabase.from("user_roles").select("*");

        if (error) {
          console.error("Error fetching user role:", error);
          throw error;
        }

        if (data) {
          setRole(data);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (session) {
      fetchUserRoles();
    }
  }, [session]);

  const handleOk = async () => {
    if ((employeeName && role === "admin") || role === "mod") {
      const newEmployee = await addEmployee({ full_name: employeeName });
      if (newEmployee) {
        setVisible(false);
        setEmployeeName("");
      }
    } else {
      setErrorText("You do not have permission to add a new employee.");
    }
  };

  return (
    <div className="w-full">
      <Button type="primary" onClick={() => setVisible(true)}>
        Add Employee
      </Button>
      <Modal
        title="Add Employee"
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        okButtonProps={{ loading }}
      >
        <Input
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Employee Name"
        />
      </Modal>
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
