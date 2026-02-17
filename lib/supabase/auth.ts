"use server"

import { redirect } from "next/navigation";
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

  if(error) {
    console.error("Error signing up:", error);
    throw new Error(error.message);
  }
};

export const login = async (email: string, password: string) => {
  const supabase = await createServerClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if(error) {
    console.log(error);
    throw new Error(error.message);
  }
  
  redirect(`/room`);
}