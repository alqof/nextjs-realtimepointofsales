import { createClient } from "@supabase/supabase-js";
import { environments } from "../config/environments";

export function createClientRealtime() {
    return createClient(
        environments.SUPABASE_URL!,
        environments.SUPABASE_ANON_KEY!,
    );
}
