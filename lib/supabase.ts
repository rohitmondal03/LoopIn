import { createClient} from "@supabase/supabase-js";
import { env } from "process";

export const supabaseClient = createClient(env.SUPABASE_URL || "", env.SUPABASE_PUBLISHABLE_KEY || "")