import { startTransition, useActionState, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { INITIAL_STATE_UPDATE_USER } from "@/lib/constants/auth-constant";
import { updateUserFromValidation, updateUserSchema } from "@/lib/validations/auth-validation";
import { toast } from "sonner";
import { Preview, profileState } from "@/lib/types";
import { Dialog } from "@/components/ui/dialog";
import { createupdateMenuSchema, createupdateMenuSchemaValidation, menuSchemaValidation } from "@/lib/validations/menu-validation";
import UiDialogCreateUpdateMenu from "./ui-dialog-create-update-menu";
import { INITIAL_STATE_CREATE_UPDATE_MENU } from "@/lib/constants/menu-constants";
import { actionUpdateMenu } from "@/lib/actions/action-menu";

export default function DialogUpdateMenu(
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
    const formresolve = useForm<createupdateMenuSchemaValidation>({
        resolver: zodResolver(createupdateMenuSchema)
    })

    const [updateMenuState, updateMenuAction, isUpdateMenuPending] = useActionState(actionUpdateMenu, INITIAL_STATE_CREATE_UPDATE_MENU)
    const [preview, setPreview] = useState<Preview | undefined>(undefined);

    const onSubmit = formresolve.handleSubmit(async (data) => {
        const formData = new FormData;
        if(currentData?.image_url !== data.image_url){
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, key==='image_url' ? (preview?.file ?? '') : value);
            })
            
            formData.append('old_image_url', currentData?.image_url ?? '')
        }else{
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            })
        }
        formData.append('id', currentData?.id ?? '');

        startTransition(() => {
            updateMenuAction(formData)
        })
    })

    useEffect(()=>{
        if(updateMenuState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {updateMenuState.errors?._form?.[0]}
                </span>,
            )
        }
        if(updateMenuState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Update Menu Item Success
                </span>,
            );
            formresolve.reset();
            handleChangeAction?.(false)
            refetch();
        }
    }, [updateMenuState])

    useEffect(()=>{
        if(currentData){
            formresolve.setValue('name', currentData.name);
            formresolve.setValue('description', currentData.description);
            formresolve.setValue('price', currentData.price.toString());
            formresolve.setValue('discount', currentData.discount.toString());
            formresolve.setValue('category', currentData.category);
            formresolve.setValue('is_available', currentData.is_available.toString());
            formresolve.setValue('image_url', currentData.image_url);
            
            setPreview({
                file: new File([], currentData.image_url as string),
                displayUrl: currentData.image_url as string
            })
        }
    }, [currentData])
    
    return(
        <Dialog open={open} onOpenChange={handleChangeAction}>
            <UiDialogCreateUpdateMenu formresolve={formresolve} onSubmit={onSubmit} isLoading={isUpdateMenuPending} type="Update" preview={preview} setPreview={setPreview} />
        </Dialog>
    )
}