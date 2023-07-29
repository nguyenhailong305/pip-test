import { supabase } from '@/utils/supabase'
import React from 'react'

export const fetchUser = async (userId : string, setState : any) => {
    try {
      let { data } = await supabase.from('users').select(`*`).eq('id', userId)
      let user = data[0]
      if (setState) setState(user)
      return user
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
   * Fetch all roles for the current user
   * @param {function} setState Optionally pass in a hook or callback to set the state
   */
  export const fetchUserRoles = async (setState : any) => {
    try {
      let { data } = await supabase.from('user_roles').select(`*`)
      console.log(data , "Aaaaaaaaaaaaaaaaaaaaaaa")
      if (setState) setState(data)
      return data
    } catch (error) {
      console.log('error', error)
    }
  }