'use server'

import { createClient } from "@/lib/supabase/server";
import { authFormState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { INITIAL_STATE_LOGIN } from "@/lib/constants/auth-constant";
import { loginSchema } from "../validations/validation-auth";

export async function actionLogin(prevState:authFormState, formData:FormData|null){
    if(!formData){
        return INITIAL_STATE_LOGIN
    }
    
    const validationFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if(!validationFields.success){
        return {
            status: 'error',
            errors: {
                ...validationFields.error.flatten().fieldErrors,
                _form: [],
            },
        }
    }

    const supabase = await createClient();
    const {error, data} = await supabase.auth.signInWithPassword(validationFields.data);
    if(error){
        return{
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message],
            }
        }
    }

    const {data: profile} = await supabase.from('profiles').select('*').eq('id', data?.user?.id).single();
    if(profile){
        const cookiesStore = await cookies();
        cookiesStore.set(
            'user_profile', 
            JSON.stringify(profile), 
            {
                httpOnly: true,
                path: '',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 365, // 1 tahun
                // maxAge: 60, // 1 menit
            }
        )
    }


    revalidatePath('/', 'layout');
    redirect('/')
}