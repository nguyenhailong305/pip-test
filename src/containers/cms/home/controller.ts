import { useCallback, useContext, useEffect, useState } from "react";
import { Database } from "@/types/schema";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/auth-helpers-react";

type Employees = Database["public"]["Tables"]["employees"]["Row"];

export default function useEmployeeList() {
  const [employees, setEmployees] = useState<Employees[]>([]);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionAuth, setSessionAuth] = useState();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const updateStatus = () => setStatus((currentStatus) => !currentStatus);

  const fetchEmployees = async () => {
    const { data: employees, error } = await supabase
      .from("employees")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.log("error", error);
    else setEmployees(employees);
  };

  const resetForm = () => {
    setUsername("");
    setFullName("");
    setAvatarUrl("");
    setIsFormOpen(false);
  };

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
  }, []);

  const addEmployee = async (employees: Partial<Employees>) => {
    const { data, error } = await supabase
      .from("employees")
      .insert([employees]);
    if (error) {
      console.error("Error adding user: ", error);
    } else {
      console.log("User added successfully: ", data);
      updateStatus();
    }
  };

  const updateEmployee = async (id: string, employee: Partial<Employees>) => {
    const { data, error } = await supabase
      .from("employees")
      .update({
        ...employee,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating employee: ", error);
    } else {
      console.log("Employee updated successfully: ", data);
      updateStatus();
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    const { data, error } = await supabase
      .from("employees")
      .delete()
      .eq("id", employeeId);

    if (error) {
      console.error("Error deleting employee: ", error);
    } else {
      console.log("Employee deleted successfully: ", data);
      updateStatus();
    }
  };

  return {
    fetchEmployees,
    employees,
    errorText,
    setErrorText,
    deleteEmployee,
    addEmployee,
    sessionAuth,
    loading,
    setUsername,
    setFullName,
    setAvatarUrl,
    username,
    avatarUrl,
    fullName,
    resetForm,
    isFormOpen,
    setIsFormOpen,
    updateEmployee,
    status,
    avatarFile,
    setAvatarFile,
  };
}
