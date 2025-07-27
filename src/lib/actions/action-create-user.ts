'use server'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createUserSchema } from "@/lib/validations/auth-validation";
import { createClient } from "@/lib/supabase/server";
import { authFormState } from "@/lib/types";
import { INITIAL_STATE_CREATE_USER } from "@/lib/constants/auth-constant";
import { actionUploadFile } from "./storage-action";

export async function actionCreateUser(prevState:authFormState, formData: FormData){
    let validationFields = createUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
        image_url: formData.get('image_url'),
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

    if (validationFields.data.image_url instanceof File) {
        const { errors, data } = await actionUploadFile(validationFields.data.name, validationFields.data.image_url, 'images', 'profiles',);
        if (errors) {
            return {
                status: 'error',
                errors: {
                    ...prevState.errors,
                    _form: [...errors._form],
                },
            };
        }
        
        validationFields = {
            ...validationFields,
            data: {
                ...validationFields.data,
                image_url: data.url,
            },
        };

    }


    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email: validationFields.data.email,
        password: validationFields.data.password,
        options: {
            data: {
                name: validationFields.data.name,
                role: validationFields.data.role,
                image_url: validationFields.data.image_url,
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
}