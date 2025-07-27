'use client';

import React, { startTransition, useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { INITIAL_FORM_LOGIN, INITIAL_STATE_LOGIN } from '@/lib/constants/auth-constant'
import { loginFormValidation, loginSchema } from '@/lib/validations/auth-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { actionLogin } from '../../../../lib/actions/action-auth-login';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';


const Login = () => {
    const formresolve = useForm<loginFormValidation>({
        resolver: zodResolver(loginSchema),
        defaultValues: INITIAL_FORM_LOGIN,
    })
    const [loginState, loginAction, isLoginPending] = useActionState(actionLogin, INITIAL_STATE_LOGIN)

    const onSubmit = formresolve.handleSubmit(async (data) => {
        const formData = new FormData;
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
        })

        // untuk menjalankan useActionState membutuhkan startTransition()
        startTransition(() => {
            loginAction(formData)
        })
    })

    useEffect(()=>{
        if(loginState?.status === 'error'){
            // toast error
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {loginState.errors?._form?.[0]}
                </span>,
                { description: "We couldn't find your account. Please register to create a new one and get started." }
            )

            startTransition(()=>{
                loginAction(null) //reset to null
            })
        }
    }, [loginState])

    return (
        <Card className='w-full md:w-2/7'>
            <CardHeader className='text-center'>
                <CardTitle className='text-xl'> Welcome Everyone </CardTitle>
                <CardDescription> Login to access all features </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...formresolve}>
                    <form className='space-y-5' onSubmit={onSubmit}>
                        {/* customade */}
                        {/* <FormInputSet formresolve={formresolve} label='email' name='email' type='email' placeholder='qwerty' /> */}

                        <FormField control={formresolve.control} name='email' render={({field}) => (
                            <FormItem>
                                <FormLabel> Email </FormLabel>
                                <FormControl>
                                    <Input {...field} type='email' placeholder='Insert your email' autoComplete='off'/>
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

                        <div>
                            <Button className='w-full mt-6' type='submit'> {isLoginPending ? <Loader/> : 'Login'} </Button>
                            <p className='mt-3 text-xs'>Don't you have account? <span className='font-bold'>Sign In</span> </p>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
export default Login