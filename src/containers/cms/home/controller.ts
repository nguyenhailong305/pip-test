import { useContext, useEffect, useState } from 'react'
import { Database } from '@/types/schema'
import { supabase } from '@/utils/supabase'
import { Session } from '@supabase/auth-helpers-react'

type Employees = Database['public']['Tables']['employees']['Row']

export default function useEmployeeList() {
  const [employees, setEmployees] = useState<Employees[]>([])
  const [errorText, setErrorText] = useState('')
  const [loading, setLoading] = useState(false);
  
  // Use the UserContext here

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

 
  return { employees, errorText, setErrorText , loading };
}