import { startTransition, useActionState, useEffect, useState } from "react";
import { INITIAL_ACTION_STATE, INITIAL_STATE_UPDATE_USER } from "@/lib/constants/auth-constant";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { actionDeleteUser } from "@/lib/actions/action-delete-user";
import { menuSchemaValidation } from "@/lib/validations/menu-validation";
import UiDialogDeleteMenu from "./ui-dialog-delete-menu";
import { title } from "process";
import { actionDeleteMenu } from "@/lib/actions/action-delete-menu";

export default function DialogDeleteMenu(
    { 
        refetch, 
        currentData, 
        open, 
        handleChangeAction 
    }: {
        refetch: ()=>void; 
        currentData?: menuSchemaValidation; 
        open?: boolean;
        handleChangeAction?: (open: boolean)=>void
    }
) {
    const [deleteMenuState, deleteMenuAction, isDeleteMenuPending] = useActionState(actionDeleteMenu, INITIAL_ACTION_STATE)
    const onSubmit = ()=>{
        const formData = new FormData();
        formData.append('id', currentData!.id as string)
        formData.append('image_url', currentData!.image_url as string)

        startTransition(()=>{
            deleteMenuAction(formData);
        })
    }


    useEffect(()=>{
        if(deleteMenuState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {deleteMenuState.errors?._form?.[0]}
                </span>,
                // { description: "Email must be a valid email address and all required fields should be filled correctly. Please check your input and try again." }
            )
        }
        if(deleteMenuState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete Menu Item Success
                </span>,
            );
            handleChangeAction?.(false)
            refetch();
        }
    }, [deleteMenuState])

    return(
        <Dialog open={open} onOpenChange={handleChangeAction}>
            <UiDialogDeleteMenu title="Menu" isLoading={isDeleteMenuPending} onSubmit={onSubmit} />
        </Dialog>
    )
}