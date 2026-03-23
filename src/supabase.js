import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://byxgcitbdxlpfqwtesej.supabase.co";
const supabaseKey = "sb_publishable_8q20CNXywIt6rsPOzwo54g_9k6Tk2--";

export const supabase = createClient(supabaseUrl, supabaseKey);