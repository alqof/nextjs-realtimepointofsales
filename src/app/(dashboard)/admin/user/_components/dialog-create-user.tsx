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
import UiDialogCreateUpdateUser from "./ui-dialog-create-update-user";

export default function DialogCreateUser({refetch}: {refetch: ()=>void}) {
    const formresolve = useForm<createUserFormValidation>({
        resolver: zodResolver(createUserSchema),
        defaultValues: INITIAL_FORM_CREATE_USER,
    })

    const [createUserState, createUserAction, isCreateUserPending] = useActionState(actionCreateUser, INITIAL_STATE_CREATE_USER)
    const [preview, setPreview] = useState<Preview | undefined>(undefined);

    const onSubmit = formresolve.handleSubmit(async (data) => {
        const formData = new FormData;
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, key==='image_url' ? (preview?.file ?? '') : value)
        })

        // untuk menjalankan useActionState membutuhkan startTransition()
        startTransition(() => {
            createUserAction(formData)
        })
    })

    useEffect(()=>{
        if(createUserState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {createUserState.errors?._form?.[0]}
                </span>,
                { description: "Email must be a valid email address and all required fields should be filled correctly. Please check your input and try again." }
            )
        }
        if(createUserState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Create User Success
                    {/* {createUserState.errors?._form?.[0]} */}
                </span>,
            );
            formresolve.reset();
            setPreview(undefined);
            document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
            refetch();
        }
    }, [createUserState])
    
    return(
        // ##### Refactor #####
        <UiDialogCreateUpdateUser formresolve={formresolve} onSubmit={onSubmit} isLoading={isCreateUserPending} type="Create" preview={preview} setPreview={setPreview} />

        // ##### Manual #####
        // <DialogContent className="sm:max-w-[425px]">
        //     <DialogHeader className="mb-5">
        //         <DialogTitle> Create User </DialogTitle>
        //         <DialogDescription> Register a new user </DialogDescription>
        //     </DialogHeader>

        //     <Form {...formresolve}>
        //         <form className='space-y-5' onSubmit={onSubmit}>
        //             {/* <FormInputSet formresolve={formresolve} label='email' name='email' type='email' placeholder='qwerty' /> */}
        //             <FormField control={formresolve.control} name='name' render={({field}) => (
        //                 <FormItem>
        //                     <FormLabel> Name </FormLabel>
        //                     <FormControl>
        //                         <Input {...field} placeholder='Insert your full name' autoComplete='off'/>
        //                     </FormControl>
        //                     <FormMessage className='text-xs'/>
        //                 </FormItem>
        //             )}/>

        //             <FormField control={formresolve.control} name='email' render={({field}) => (
        //                 <FormItem>
        //                     <FormLabel> Email </FormLabel>
        //                     <FormControl>
        //                         <Input {...field} type='email' placeholder='Insert your email' autoComplete='off'/>
        //                     </FormControl>
        //                     <FormMessage className='text-xs'/>
        //                 </FormItem>
        //             )}/>

        //             <FormField control={formresolve.control} name='role' render={({field: {onChange, ...rest}}) => (
        //                 <FormItem>
        //                     <FormLabel> Role </FormLabel>
        //                     <FormControl>
        //                         <Select {...rest} onValueChange={onChange}>
        //                             <SelectTrigger className={cn('w-full', {'border-red-600': formresolve.formState.errors['role']?.message})}>
        //                                 <SelectValue placeholder="Select Role" />
        //                             </SelectTrigger>
        //                             <SelectContent>
        //                                 <SelectGroup>
        //                                     <SelectLabel> Role </SelectLabel>
        //                                     {INITIAL_ROLE.map((item)=>(
        //                                         <SelectItem key={item.label} value={item.value} className="capitalize"> {item.label} </SelectItem>
        //                                     ))}
        //                                 </SelectGroup>
        //                             </SelectContent>
        //                         </Select>
        //                     </FormControl>
        //                     <FormMessage className='text-xs'/>
        //                 </FormItem>
        //             )}/>

        //             <FormField control={formresolve.control} name="image_url" render={({ field: { onChange, ...rest } }) => (
        //                 <FormItem>
        //                     <FormLabel> Image </FormLabel>
        //                     <FormControl>
        //                         <div className="">
        //                             <Avatar className="w-24 h-24 mb-2 rounded-lg">
        //                                 <AvatarImage src={preview?.displayUrl} alt="preview" className="object-cover"/>
        //                                 <AvatarFallback className="rounded-lg w-full h-full flex items-center justify-center">
        //                                     <UserRound className="w-2/3 h-2/3"/>
        //                                 </AvatarFallback>
        //                             </Avatar>
        //                             <Input
        //                                 id="file-upload"
        //                                 className="hidden"
        //                                 type="file" 
        //                                 name={rest.name} 
        //                                 ref={rest.ref} 
        //                                 onBlur={rest.onBlur} 
        //                                 disabled={rest.disabled} 
        //                                 accept="image/*"
        //                                 onChange={ async (event) => { 
        //                                         onChange(event);
        //                                         const { file, displayUrl } = getImageData(event);
        //                                         if (file) {
        //                                             setPreview?.({ file, displayUrl });
        //                                         }
        //                                     }
        //                                 }
        //                             />
        //                             <label htmlFor="file-upload" className="w-full max-w-full px-3 py-2 flex items-center justify-center gap-2 border border-dashed border-gray-600 bg-gray-900/80 text-sm text-gray-100 rounded-md cursor-pointer transition hover:bg-gray-800 hover:border-primary" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
        //                                 <Camera className="w-4 h-4" />
        //                                 {preview?.file?.name ? (
        //                                     <span className="text-foreground break-words w-full"> {preview.file.name} </span>
        //                                 ) : (
        //                                     <span className="text-muted-foreground">Choose File</span>
        //                                 )}
        //                             </label>
        //                         </div>
        //                     </FormControl>
        //                     <FormMessage className="text-xs" />
        //                 </FormItem>
        //                 )}
        //             />

        //             <FormField control={formresolve.control} name='password' render={({field}) => (
        //                 <FormItem>
        //                     <FormLabel> Password </FormLabel>
        //                     <FormControl>
        //                         <Input {...field} type='password' placeholder='********' autoComplete='off'/>
        //                     </FormControl>
        //                     <FormMessage className='text-xs'/>
        //                 </FormItem>
        //             )}/>

        //             <DialogFooter>
        //                 <DialogClose asChild>
        //                     <Button
        //                         className="cursor-pointer"
        //                         variant="outline"
        //                         type="button"
        //                         onClick={() => {
        //                             formresolve.reset();
        //                             setPreview(undefined);
        //                         }}
        //                     >
        //                         Cancel
        //                     </Button>
        //                 </DialogClose>

        //                 <Button className='cursor-pointer' type="submit"> {isCreateUserPending ? <Loader className="animate-spin"/> : 'Submit'} </Button>
        //             </DialogFooter>
        //         </form>
        //     </Form>
        // </DialogContent>
    )
}