'use server'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createUserSchema, updateUserSchema } from "@/lib/validations/validation-auth";
import { createClient } from "@/lib/supabase/server";
import { authFormState } from "@/lib/types";
import { INITIAL_STATE_CREATE_USER } from "@/lib/constants/auth-constant";
import { actionDeleteFile, actionUploadFile } from "./storage-action";


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
        const { errors, data } = await actionUploadFile(validationFields.data.name, validationFields.data.image_url, 'images', 'profiles', oldImageUrl.split('/images/')[1]);
        
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


export async function actionDeleteUser(prevState: authFormState, formData: FormData) {
    const supabase = await createClient({ isAdmin: true });
    
    // delete storage
    const image = formData.get('image_url') as string;
    const { status, errors } = await actionDeleteFile('images', image.split('/images/')[1]);
    if (status === 'error') {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [errors?._form?.[0] ?? 'unknown error'],
            },
        };
    }

    // delete user from supabase
    const id = formData.get('id') as string;
    if (!id) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ['User ID is missing'],
            },
        };
    }
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error?.message ?? 'Failed to delete user'],
            },
        };
    }

    return { status: 'success' };
}