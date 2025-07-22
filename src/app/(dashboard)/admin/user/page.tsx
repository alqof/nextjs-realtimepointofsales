'use client'
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideClockFading, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { count } from "console";
import { toast } from "sonner";

export default function userPage(){
    const supabase = createClient();

    const {data:users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async()=>{
            const {data, error} = await supabase.from('profiles').select('*', {count: 'exact'}).order('created_at')

            if(error){
                toast(
                    <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                            <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                        </svg>
                        {error.message}
                    </span>,
                    { description: "Get user data failed." }
                )
            }

            return data
        }
    })
    
    return(
        <div className="w-full">
            <div className="w-full mb-2 flex flex-col lg:flex-row justify-between gap-2">
                <h1 className="text-2xl font-bold">User Management</h1>

                <div className="flex gap-2">
                    <Input placeholder="Search...."/>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"> <Plus/> Create </Button>
                        </DialogTrigger>

                        <DialogContent>
                            {/*  */}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading && <div><LucideClockFading/></div> }

            {users?.map((user) => (
                <div key={user.id}>
                    <h2>Name: {user.name}</h2>
                    <h2>Role: {user.role}</h2>
                </div>
            ))}
        </div>
    )
}