'use server'

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";
import { error } from "console";
import { redirect } from "next/navigation";


export async function signOut() {
    const supabase = await createClient();
    const cookieStore = await cookies();

    try {
        await supabase.auth.signOut();
        cookieStore.delete('user_profile');
    } catch {
        console.log('Error signing out: ',error)
    }

    revalidatePath('/', 'layout');
    redirect('/login');
}