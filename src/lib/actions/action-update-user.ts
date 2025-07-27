'use server'
import { updateUserSchema } from "@/lib/validations/auth-validation";
import { createClient } from "@/lib/supabase/server";
import { authFormState } from "@/lib/types";
import { actionUploadFile } from "./storage-action";

export async function actionUpdateUser(prevState:authFormState, formData:FormData){
    let validationFields = updateUserSchema.safeParse({
        name: formData.get('name'),
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
        const oldImageUrl = formData.get('old_image_url') as string;
        const { errors, data } = await actionUploadFile(
            validationFields.data.name,
            validationFields.data.image_url,
            'images',
            'profiles',
            oldImageUrl.split('/images/')[1],
        );
        
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
    const { error } = await supabase
        .from('profiles')
        .update({
            name: validationFields.data.name,
            role: validationFields.data.role,
            image_url: validationFields.data.image_url,
        })
        .eq('id', formData.get('id'))
    ;

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
    };
}