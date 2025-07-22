'use client';
import { useAuthStore } from "@/lib/store/auth-store";
import { createClient } from "@/lib/supabase/client";
import { profileState } from "@/lib/types";
import { ReactNode, useEffect } from "react";


export default function AuthStoreProvider(
    {
        children, 
        profile,
    }: {
        children: ReactNode;
        profile: profileState;
    }
){
    useEffect(()=>{
        const supabase = createClient();
        supabase.auth.getUser().then(({data: {user}}) => {
            useAuthStore.getState().setUser(user);
            useAuthStore.getState().setProfile(profile)
        })
        // tanpa desctructuring
        // supabase.auth.getUser().then((res) => {
        //     useAuthStore.getState().setUser(res.data.user);
        //     useAuthStore.getState().setProfile(profile);
        // });

    })
    
    return <>
        {children}
    </>
}