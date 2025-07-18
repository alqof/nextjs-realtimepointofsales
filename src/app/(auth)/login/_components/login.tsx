'use client';

import FormInputSet from '@/components/form-input-set';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { INITIAL_LOGIN_FORM } from '@/lib/constants/auth-constant'
import { loginSchemaValidation, LoginState } from '@/lib/controller/auth-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

const Login = () => {
    const formresolve = useForm<LoginState>({
        resolver: zodResolver(loginSchemaValidation),
        defaultValues: INITIAL_LOGIN_FORM,
        // defaultValues: {
        //     email: '',
        //     password: '',
        // },
    })
    // console.log(formresolve)

    const onSubmit = formresolve.handleSubmit(async (data) => {
        console.log(data)
    })

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
                                    <Input {...field} type='password' placeholder='Insert your password' autoComplete='off'/>
                                </FormControl>
                                <FormMessage className='text-xs'/>
                            </FormItem>
                        )}/>

                        <div>
                            <Button className='w-full mt-6'> Submit </Button>
                            <p className='mt-3 text-xs'>Don't you have account? <span className='font-bold'>Sign In</span> </p>
                        </div>
                    </form>
                </Form>
            </CardContent>

            {/* <CardFooter>
                <p>Card Footer</p>
            </CardFooter> */}
        </Card>
    )
}

export default Login