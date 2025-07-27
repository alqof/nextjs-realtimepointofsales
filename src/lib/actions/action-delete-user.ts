'use server'
import { createClient } from "@/lib/supabase/server";
import { authFormState } from "@/lib/types";
import { actionDeleteFile } from "./storage-action";


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
