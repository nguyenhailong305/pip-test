import { User } from "@supabase/auth-helpers-nextjs";


export interface UserDetails {
    id : string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    website?: string;
}