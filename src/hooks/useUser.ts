import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { CLIENT_RENEG_LIMIT } from 'tls';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession();
   

    setUser(session ? session.user : null);
    setLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session ? session.user : null);
        setLoading(false);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      checkUserRole();
      checkUserPermission('create');
    }
  }, [user]);

  const checkUserRole = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user role: ', error);
    } else {
      setIsAdmin(data?.role === 'admin');
    }
  };

  const checkUserPermission = async (permission) => {
    const { data, error } = await supabase
      .from('role_permission')
      .select('*')
      .eq('user_id', user.id)
      .eq('permission', permission)
      .single();

    if (error) {
      console.error('Error fetching user permission: ', error);
    } else {
      setCanCreate(!!data || isAdmin);
    }
  };

  return { user, loading, isAdmin, canCreate };
}