import { User } from "@supabase/supabase-js"
import { profileState } from "../types";
import { create } from 'zustand';
import { INITIAL_PROFILE_STATE } from "../constants/auth-constant";

type AuthState = {
    user: User | null;
    profile: profileState;
    setUser: (user: User | null) => void;
    setProfile: (profile: profileState) => void;
}

export const useAuthStore = create<AuthState>((set)=>({
    user: null,
    profile: INITIAL_PROFILE_STATE,
    setUser: (user) => set({user}),
    setProfile: (profile) => set({profile}),
}))