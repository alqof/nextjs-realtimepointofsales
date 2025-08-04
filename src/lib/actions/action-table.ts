'use server'
import { createClient } from "@/lib/supabase/server";
import { tableFormState } from "../types";
import { tableSchema } from "../validations/validation-table";


export async function actionCreateTable(prevState:tableFormState, formData: FormData){
    const validationFields = tableSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        capacity: parseInt(formData.get('capacity') as string),
        status: formData.get('status'),
    })

    if(!validationFields.success){
        const fieldErrors = Object.values(validationFields.error.flatten().fieldErrors).flat().filter(Boolean);

        return {
            status: 'error',
            errors: {
                ...validationFields.error.flatten().fieldErrors,
                _form: fieldErrors.length > 0 ? fieldErrors : ['Form input is invalid!'],
            },
        }
    }

    const supabase = await createClient();
    const { error } = await supabase.from('tables').insert({
        name: validationFields.data.name,
        description: validationFields.data.description,
        capacity: validationFields.data.capacity,
        status: validationFields.data.status,
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


// Update
export async function actionUpdateTable(prevState:tableFormState, formData: FormData){
    const validationFields = tableSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        capacity: parseInt(formData.get('capacity') as string),
        status: formData.get('status'),
    })
    if(!validationFields.success){
        const fieldErrors = Object.values(validationFields.error.flatten().fieldErrors).flat().filter(Boolean);

        return {
            status: 'error',
            errors: {
                ...validationFields.error.flatten().fieldErrors,
                _form: fieldErrors.length > 0 ? fieldErrors : ['Form input is invalid!'],
            },
        }
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from('tables')
        .update({
            name: validationFields.data.name,
            description: validationFields.data.description,
            capacity: validationFields.data.capacity,
            status: validationFields.data.status,
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
    }
}


// Delete
export async function actionDeleteTable(prevState: tableFormState, formData: FormData) {
    const supabase = await createClient();
    
    // Get current user && Ambil role user dari table profiles
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["Unauthorized access!"],
            },
        };
    }
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
    ;
    if (profileError || !profile) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["Profile not found!"],
            },
        };
    }
    if (profile.role !== "admin") { // Hanya admin yang bisa delete
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["You are not allowed to delete menu."],
            },
        };
    }

    // delete item from supabase
    const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', formData.get('id'))
    ;

    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message],
            },
        };
    }

    return { status: 'success' };
}