import { startTransition, useActionState, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserFromValidation, updateUserSchema } from "@/lib/validations/validation-auth";
import { toast } from "sonner";
import { Preview, profileState } from "@/lib/types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UiDialogDeleteUser from "./ui-dialog-delete-user";
import { actionDeleteUser } from "@/lib/actions/action-user";
import { INITIAL_ACTION_STATE } from "@/lib/constants/general-constant";

export default function DialogDeleteUser(
    { 
        refetch, 
        currentData, 
        open, 
        handleChangeAction 
    }: {
        refetch: ()=>void; 
        currentData?: profileState; 
        open?: boolean;
        handleChangeAction?: (open: boolean)=>void
    }
) {
    const [deleteUserState, deleteUserAction, isDeleteUserPending] = useActionState(actionDeleteUser, INITIAL_ACTION_STATE)
    const onSubmit = ()=>{
        const formData = new FormData();
        formData.append('id', currentData!.id as string)
        formData.append('image_url', currentData!.image_url as string)

        startTransition(()=>{
            deleteUserAction(formData);
        })
    }


    useEffect(()=>{
        if(deleteUserState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {deleteUserState.errors?._form?.[0]}
                </span>,
                // { description: "Email must be a valid email address and all required fields should be filled correctly. Please check your input and try again." }
            )
        }
        if(deleteUserState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete User Success
                    {/* {createUserState.errors?._form?.[0]} */}
                </span>,
            );
            handleChangeAction?.(false)
            refetch();
        }
    }, [deleteUserState])

    return(
        <Dialog open={open} onOpenChange={handleChangeAction}>
            <UiDialogDeleteUser title="User" isLoading={isDeleteUserPending} onSubmit={onSubmit} />
        </Dialog>
    )
}