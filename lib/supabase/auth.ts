"use server"

import { createClient } from "./server";

export const signUp = async (email: string, password: string, name: string) => {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      },
    },
  });

  return error;
};

export const login = async (email: string, password: string) => {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return error;
}