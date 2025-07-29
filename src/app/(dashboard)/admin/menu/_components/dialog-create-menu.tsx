import { startTransition, useActionState, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INITIAL_FORM_CREATE_USER, INITIAL_ROLE, INITIAL_STATE_CREATE_USER } from "@/lib/constants/auth-constant";
import { createUserFormValidation, createUserSchema } from "@/lib/validations/auth-validation";
import { actionCreateUser } from "@/lib/actions/action-create-user";
import { toast } from "sonner";
import { Camera, FileImage, Loader, UserRound } from "lucide-react";
import { cn, getImageData } from "@/lib/utils";
import { Preview } from "@/lib/types";
import UiDialogCreateUpdateMenu from "./ui-dialog-create-update-menu";
import { createupdateMenuSchema, createupdateMenuSchemaValidation } from "@/lib/validations/menu-validation";
import { INITIAL_FORM_MENU, INITIAL_STATE_CREATE_MENU } from "@/lib/constants/menu-constants";
import { actionCreateMenu } from "@/lib/actions/action-create-menu";

export default function DialogCreateMenu({refetch}: {refetch: ()=>void}) {
    const formresolve = useForm<createupdateMenuSchemaValidation>({
        resolver: zodResolver(createupdateMenuSchema),
        defaultValues: INITIAL_FORM_MENU,
    })

    const [createMenuState, createMenuAction, isCreateMenuPending] = useActionState(actionCreateMenu, INITIAL_STATE_CREATE_MENU)
    const [preview, setPreview] = useState<Preview | undefined>(undefined);

    const onSubmit = formresolve.handleSubmit(async (data) => {
        const formData = new FormData;
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, key==='image_url' ? (preview?.file ?? '') : value)
        })

        // untuk menjalankan useActionState membutuhkan startTransition()
        startTransition(() => {
            createMenuAction(formData)
        })
    })

    useEffect(()=>{
        if(createMenuState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {createMenuState.errors?._form?.[0]}
                </span>,
                // { description: "Email must be a valid email address and all required fields should be filled correctly. Please check your input and try again." }
            )
        }
        if(createMenuState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Create Menu Success
                </span>,
            );
            formresolve.reset();
            setPreview(undefined);
            document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
            refetch();
        }
    }, [createMenuState])
    
    return(
        <UiDialogCreateUpdateMenu formresolve={formresolve} onSubmit={onSubmit} isLoading={isCreateMenuPending} type="Create" preview={preview} setPreview={setPreview} />
    )
}