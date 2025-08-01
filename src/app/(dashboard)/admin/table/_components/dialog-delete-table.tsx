import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { menuSchemaValidation } from "@/lib/validations/validation-menu";
import UiDialogDeleteTable from "./ui-dialog-delete-table";
import { actionDeleteTable } from "@/lib/actions/action-table";
import { tableSchemaValidation } from "@/lib/validations/validation-table";
import { INITIAL_ACTION_STATE } from "@/lib/constants/general-constant";

export default function DialogDeleteTable(
    { 
        refetch, 
        currentData, 
        open, 
        handleChangeAction 
    }: {
        refetch: ()=>void; 
        currentData?: tableSchemaValidation; 
        open?: boolean;
        handleChangeAction?: (open: boolean)=>void
    }
) {
    const [deleteTableState, deleteTableAction, isPendingDeleteTable] = useActionState(actionDeleteTable, INITIAL_ACTION_STATE)
    const onSubmit = ()=>{
        const formData = new FormData();
        formData.append('id', currentData!.id as string)

        startTransition(()=>{
            deleteTableAction(formData);
        })
    }


    useEffect(()=>{
        if(deleteTableState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {deleteTableState.errors?._form?.[0]}
                </span>,
            )
        }
        if(deleteTableState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete Dining Table Success
                </span>,
            );
            handleChangeAction?.(false)
            refetch();
        }
    }, [deleteTableState])

    return(
        <Dialog open={open} onOpenChange={handleChangeAction}>
            <UiDialogDeleteTable title="Table" isLoading={isPendingDeleteTable} onSubmit={onSubmit} />
        </Dialog>
    )
}