'use server'
import { createClient } from "@/lib/supabase/server";
import { menuFormState } from "@/lib/types";
import { actionDeleteFile } from "./storage-action";


export async function actionDeleteMenu(prevState: menuFormState, formData: FormData) {
    const supabase = await createClient();
    
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