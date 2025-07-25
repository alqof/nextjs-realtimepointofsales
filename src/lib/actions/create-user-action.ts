'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createUserSchemaValidation, loginSchemaValidation } from "@/lib/validations/auth-validation";
import { createClient } from "@/lib/supabase/server";
import { authFormState } from "@/lib/types";
import { INITIAL_STATE_CREATE_USER } from "@/lib/constants/auth-constant";

export async function actionCreateUser(prevState:authFormState, formData:FormData|null){
    if(!formData){
        return INITIAL_STATE_CREATE_USER
    }

    const validationFields = createUserSchemaValidation.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        // image_url: formData.get('image_url'),
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

    const supabase = await createClient({});
    const { error } = await supabase.auth.signUp({
        email: validationFields.data.email,
        password: validationFields.data.password,
        options: {
            data: {
                name: validationFields.data.name,
                role: validationFields.data.role,
                // image_url: validationFields.data.image_url,
            }
        }
    });

    if(error){
        return{
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message],
            }
        }
    }

    return {
        status: 'success'
    }


    // revalidatePath('/', 'layout');
    // redirect('/')
}