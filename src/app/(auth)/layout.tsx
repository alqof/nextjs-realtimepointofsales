import { ThemeToggle } from '@/components/theme-toggle'
import { Coffee } from 'lucide-react'
import React from 'react'
import LoginPage from './login/page'


export default function AuthLayout({children}: {children: React.ReactNode}){
    return (
        <div className="relative min-h-svh p-6 md:p-10 flex flex-col items-center justify-center gap-6">
            <div className='absolute top-3 right-3'>
                <ThemeToggle/>
            </div>

            <div className="p-3 mb-3 flex justify-between items-center">
                <div className='flex gap-3'>
                    <div className="p-2 rounded-md bg-green-600">
                        <Coffee size={24} className="inline md:hidden"/>
                        <Coffee size={28} className="hidden md:inline"/>
                    </div>
                    <p className='text-2xl md:text-3xl font-bold drop-shadow-md drop-shadow-green-400'> QopzKuy </p>
                </div>
            </div>

            {children}
        </div>
    )
}