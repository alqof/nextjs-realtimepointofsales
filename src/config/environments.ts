// untuk memanggi, lSUPABASE_URL, SUPABASE_ANON_KEYSUPABASE_SERVICE_ROLE_KEY
// tanpa harus menulis ulang process.env.blablablal....

export const environments = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
}