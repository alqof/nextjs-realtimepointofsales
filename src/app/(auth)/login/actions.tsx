'use server'

import { loginSchemaValidation } from "@/lib/controller/auth-validation";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function Login(prevState:AuthFormState, formData:FormData){
    const validationFields = loginSchemaValidation.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })
    // console.log(validationFields)

    if(!validationFields.success){
        return {
            status: 'error',
            errors: validationFields.error.flatten().fieldErrors,
        }
    }

    const supabase = await createClient({});
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
                maxAge: 60 * 60 * 24 * 365,
            }
        )
    }


    revalidatePath('/', 'layout');
    redirect('/')
}