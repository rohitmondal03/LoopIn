"use server";

import { createServerClient } from "../supabase";

export const fetchUserNameByID = async (userId: string) => {
  const { data, error } = await (await createServerClient())
    .from("users")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user details:", error);
    throw new Error("Failed to fetch user details");
  }

  if (!data) {
    console.error("User not found");
    throw new Error("User not found");
  }

  return data.full_name as string;
};
