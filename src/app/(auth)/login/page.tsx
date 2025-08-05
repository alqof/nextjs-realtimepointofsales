import { Metadata } from 'next'
import React from 'react'
import Login from './_components/login'


export const metadata: Metadata = {
    title: 'Qashless | Login'
}

const LoginPage = () => {
    return (
        <Login />
    )
}
export default LoginPage