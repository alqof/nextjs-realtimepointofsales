import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Coffee } from 'lucide-react'
import React from 'react'
import { Toaster } from 'sonner'
import DashboardBreadcrumb from './_components/dashboard-breadcrumb'


export default function LayoutDashborad({children}: {children: React.ReactNode}){
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className='overflow-x-hidden'>
                <header className="h-16 flex justify-between items-center shrink-0 gap-2 transition-[width, height] ease-linear group-has-data[collabsible=icon]/sidebar-wrapper:h-12">
                    <div className="px-4 flex items-center gap-2">
                        <SidebarTrigger className='cursor-pointer'/>
                        <Separator orientation='vertical' className='data-[orientation=vertical]:h-5 mr-2 bg-stone-800 dark:bg-stone-500'/>
                        <DashboardBreadcrumb/>
                    </div>
                    <div className="px-4">
                        <ThemeToggle/>
                    </div>
                </header>
                {/* <main className="p-4 flex flex-1 flex-col items-center gap-4"> */}
                <main className="p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}