"use server"

import { createServerClient } from ".";

export const signUp = async (email: string, password: string, name: string) => {
  const supabase = await createServerClient();
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  return error;
};

export const login = async (email: string, password: string) => {
  const supabase = await createServerClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return error;
}