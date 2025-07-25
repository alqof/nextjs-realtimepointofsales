import { startTransition, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { INITIAL_FORM_CREATE_USER, INITIAL_ROLE, INITIAL_STATE_CREATE_USER } from "@/lib/constants/auth-constant";
import { createUserSchemaValidation, validationCreateUserForm } from "@/lib/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { actionCreateUser } from "@/lib/actions/create-user-action";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function DialogCreateUser({refetch}: {refetch: ()=>void}) {
    const formresolve = useForm<validationCreateUserForm>({
        resolver: zodResolver(createUserSchemaValidation),
        defaultValues: INITIAL_FORM_CREATE_USER,
    })

    const [createUserState, createUserAction, isCreateUserPending] = useActionState(actionCreateUser, INITIAL_STATE_CREATE_USER)

    const onSubmit = formresolve.handleSubmit(async (data) => {
        const formData = new FormData;
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
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
            document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
            refetch();
        }
    }, [createUserState])
    
    return(
        
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="mb-5">
                <DialogTitle> Create User </DialogTitle>
                <DialogDescription> Register a new user </DialogDescription>
            </DialogHeader>

            <Form {...formresolve}>
                <form className='space-y-5' onSubmit={onSubmit}>
                    {/* <FormInputSet formresolve={formresolve} label='email' name='email' type='email' placeholder='qwerty' /> */}
                    <FormField control={formresolve.control} name='name' render={({field}) => (
                        <FormItem>
                            <FormLabel> Name </FormLabel>
                            <FormControl>
                                <Input {...field} placeholder='Insert your full name' autoComplete='off'/>
                            </FormControl>
                            <FormMessage className='text-xs'/>
                        </FormItem>
                    )}/>

                    <FormField control={formresolve.control} name='email' render={({field}) => (
                        <FormItem>
                            <FormLabel> Email </FormLabel>
                            <FormControl>
                                <Input {...field} type='email' placeholder='Insert your email' autoComplete='off'/>
                            </FormControl>
                            <FormMessage className='text-xs'/>
                        </FormItem>
                    )}/>

                    <FormField control={formresolve.control} name='role' render={({field: {onChange, ...rest}}) => (
                        <FormItem>
                            <FormLabel> Role </FormLabel>
                            <FormControl>
                                <Select {...rest} onValueChange={onChange}>
                                    <SelectTrigger className={cn('w-full', {'border-red-600': formresolve.formState.errors['role']?.message})}>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel> Role </SelectLabel>
                                            {INITIAL_ROLE.map((item)=>(
                                                <SelectItem key={item.label} value={item.value} className="capitalize"> {item.label} </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className='text-xs'/>
                        </FormItem>
                    )}/>

                    <FormField control={formresolve.control} name='password' render={({field}) => (
                        <FormItem>
                            <FormLabel> Password </FormLabel>
                            <FormControl>
                                <Input {...field} type='password' placeholder='********' autoComplete='off'/>
                            </FormControl>
                            <FormMessage className='text-xs'/>
                        </FormItem>
                    )}/>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button className="cursor-pointer" variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button className='cursor-pointer' type="submit"> {isCreateUserPending ? <Loader/> : 'Submit'} </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}