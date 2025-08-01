import { startTransition, useActionState, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { INITIAL_STATE_CREATE_UPDATE_TABLE } from "@/lib/constants/table-constant";
import { createupdateTableSchema, createupdateTableSchemaValidation, tableSchemaValidation } from "@/lib/validations/validation-table";
import { actionUpdateTable } from "@/lib/actions/action-table";
import UiDialogCreateUpdateTable from "./ui-dialog-create-update-table";

export default function DialogUpdateTable(
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
    const formresolve = useForm<createupdateTableSchemaValidation>({
        resolver: zodResolver(createupdateTableSchema)
    })

    const [UpdateTableState, UpdateTableAction, isPendingUpdateTable] = useActionState(actionUpdateTable, INITIAL_STATE_CREATE_UPDATE_TABLE)

    const onSubmit = formresolve.handleSubmit(async (data) => {
        const formData = new FormData;
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        formData.append('id', currentData?.id ?? '');
        
        console.log(formData) 
        startTransition(() => {
            UpdateTableAction(formData)
        })
    })

    useEffect(()=>{
        if(UpdateTableState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {UpdateTableState.errors?._form?.[0]}
                </span>,
            )
        }
        if(UpdateTableState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Update Dining Table Success
                </span>,
            );
            formresolve.reset();
            handleChangeAction?.(false)
            refetch();
        }
    }, [UpdateTableState])

    useEffect(()=>{
        if(currentData){
            formresolve.setValue('name', currentData.name);
            formresolve.setValue('description', currentData.description);
            formresolve.setValue('capacity', currentData.capacity.toString());
            formresolve.setValue('status', currentData.status);
        }
    }, [currentData])
    
    return(
        <Dialog open={open} onOpenChange={handleChangeAction}>
            <UiDialogCreateUpdateTable formresolve={formresolve} onSubmit={onSubmit} isLoading={isPendingUpdateTable} type="Update" />
        </Dialog>
    )
}