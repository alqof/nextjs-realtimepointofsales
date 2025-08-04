'use server'
import { createClient } from "@/lib/supabase/server";
import { actionDeleteFile, actionUploadFile } from "./storage-action";
import { menuSchema } from "../validations/validation-menu";
import { menuFormState } from "../types";

export async function actionCreateMenu(prevState:menuFormState, formData: FormData){
    let validationFields = menuSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        discount: parseFloat(formData.get('discount') as string),
        category: formData.get('category'),
        image_url: formData.get('image_url'),
        is_available: formData.get('is_available')==='true' ? true : false,
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

    if (validationFields.data.image_url instanceof File) {
        const { errors, data } = await actionUploadFile(validationFields.data.name, validationFields.data.image_url, 'images', 'menus',);
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
    const { error } = await supabase.from('menus').insert({
        name: validationFields.data.name,
        description: validationFields.data.description,
        price: validationFields.data.price,
        discount: validationFields.data.discount,
        category: validationFields.data.category,
        image_url: validationFields.data.image_url,
        is_available: validationFields.data.is_available,
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


export async function actionUpdateMenu(prevState:menuFormState, formData: FormData){
    let validationFields = menuSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        discount: parseFloat(formData.get('discount') as string),
        category: formData.get('category'),
        image_url: formData.get('image_url'),
        is_available: formData.get('is_available') === 'true' ? true : false,
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

    if (validationFields.data.image_url instanceof File) {
        const oldImageUrl = formData.get('old_image_url') as string;
        const { errors, data } = await actionUploadFile(validationFields.data.name, validationFields.data.image_url, 'images', 'menus', oldImageUrl.split('/images/')[1]);
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
        .from('menus')
        .update({
            name: validationFields.data.name,
            description: validationFields.data.description,
            price: validationFields.data.price,
            discount: validationFields.data.discount,
            category: validationFields.data.category,
            image_url: validationFields.data.image_url,
            is_available: validationFields.data.is_available,
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


export async function actionDeleteMenu(prevState: menuFormState, formData: FormData) {
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

    // Hanya admin yang bisa delete
    if (profile.role !== "admin") {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["You are not allowed to delete menu."],
            },
        };
    }
    
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

    // delete menu from supabase
    const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', formData.get('id'));

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