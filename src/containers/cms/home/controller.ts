import { useContext, useEffect, useState } from 'react'
import { Database } from '@/types/schema'
import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/auth-helpers-react'
import UserContext from '@/utils/useContext'

type Employees = Database['public']['Tables']['employees']['Row']

export default function useEmployeeList() {
  const [employees, setEmployees] = useState<Employees[]>([])
  const [errorText, setErrorText] = useState('')
  const [loading, setLoading] = useState(false);
  
  // Use the UserContext here
  const { user, userRoles } = useContext(UserContext)

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .order('id', { ascending: true })

      if (error) console.log('error', error)
      else setEmployees(employees)
    }

    fetchEmployees()
  }, [supabase])

  const addEmployee = async (employeeData : any) => {
    if (!userRoles.includes('admin') && !userRoles.includes('mod')) {
      setErrorText('You do not have permission to add a new employee.');
      return null;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData]);

    setLoading(false);

    if (error) {
      console.error('Error adding employee: ', error);
      return null;
    } else {
      return data;
    }
  };

  const deleteEmployee = async (id: number) => {
    if (!userRoles.includes('admin') && !userRoles.includes('mod')) {
      setErrorText('You do not have permission to delete an employee.');
      return null;
    }

    try {
      await supabase.from('employees').delete().eq('id', id).throwOnError()
      setEmployees(employees.filter((x) => x.id != id))
    } catch (error) {
      console.log('error', error)
    }
  }

  return { employees, errorText, setErrorText, deleteEmployee , loading, addEmployee };
}