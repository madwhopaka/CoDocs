'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const supabase = createClient();
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('User:', user);

    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, [supabase]);

  return <AuthContext.Provider value={{ user, supabase }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
