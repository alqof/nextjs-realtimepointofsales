import { ThemeToggle } from '@/components/theme-toggle'
import { Coffee } from 'lucide-react'
import React from 'react'
import LoginPage from './login/page'
import { Toaster } from 'sonner'


export default function AuthLayout({children}: {children: React.ReactNode}){
    return (
        <div className="relative min-h-svh p-6 md:p-10 flex flex-col items-center justify-center gap-5">
            <div className='absolute top-3 right-3'>
                <ThemeToggle/>
            </div>
            <Toaster position='top-center' />
            {children}
        </div>
    )
}