'use server';
import { environments } from "@/lib/config/environments";
import { createClient } from "../supabase/server";


export async function actionUploadFile(name: string, file: File, bucket: string, path: string, prevPath?: string) {
    const supabase = await createClient();
    const getName = name
    const now = new Date();
    const date = now.toISOString().slice(0,10).replace(/-/g,''); // yyyymmdd
    const time = now.toTimeString().slice(0,5).replace(/:/g,''); // hhmm
    const cleanFileName = file.name.replace(/\s+/g, '-').toLowerCase();
    
    const newPath = `${path}/${getName}-${date}${time}-${cleanFileName}`;
    // const newPath = `${path}/${Date.now()}-${file.name}`;

    // Hapus file sebelumnya kalau ada
    if(prevPath){
        const {error} = await supabase.storage.from(bucket).remove([prevPath])
        if(error){
            return {
                status: 'error',
                errors: { _form: [error.message] },
            }
        }
    }

    // Upload file baru
    const { error } = await supabase.storage.from(bucket).upload(newPath, file);
    if (error) {
        return {
            status: 'error',
            errors: {
                _form: [error.message],
            },
        };
    }


    return {
        status: 'success',
        data: {
            url: `${environments.SUPABASE_URL}/storage/v1/object/public/${bucket}/${newPath}`,
            path: newPath,
        },
    };
}

export async function actionDeleteFile(bucket: string, path: string){
    const supabase = await createClient();
    const {error} = await supabase.storage.from(bucket).remove([path])
    if (error) {
        return {
            status: 'error',
            errors: { _form: [error.message] },
        };
    }

    return { status: 'success' };
}