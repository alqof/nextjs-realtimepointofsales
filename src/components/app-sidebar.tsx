'use client'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Calendar, ChevronUp, CircleUserRound, Coffee, EllipsisVertical, Home, Inbox, LogOut, Search, Settings, ShoppingCart, User2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { SIDEBAR_MENU, SidebarMenuKey } from "@/lib/constants/dashboard-constant"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/actions/auth-logout-action"
import { useAuthStore } from "@/lib/store/auth-store"


export function AppSidebar() {
    const { isMobile } = useSidebar();
    const pathname = usePathname()
    const profile = useAuthStore((state) => state.profile);
    console.log(profile)

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="hover:bg-transparent focus:bg-transparent active:bg-transparent" size="lg">
                            <div>
                                <div className="p-2 flex items-center justify-center rounded-md bg-green-600">
                                    <Coffee className="size-4" />
                                </div>
                                <p className='text-2xl font-bold drop-shadow-md drop-shadow-green-400'> QopzKuy </p>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel> Menu </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {SIDEBAR_MENU[profile.role as SidebarMenuKey]?.map((item)=>(
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                        asChild 
                                        tooltip={item.title} 
                                        className={cn(
                                            'h-auto p-3 flex items-center gap-2 rounded-md transition-colors',
                                            {
                                                'bg-green-600 hover:bg-green-700 text-white hover:text-white': pathname === item.url,
                                                'hover:bg-zinc-200 dark:hover:bg-zinc-800': pathname !== item.url,
                                            }
                                        )}
                                    >
                                        <a href={item.url}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <Avatar className="w-8 h-8 rounded-full">
                                        <AvatarImage src={profile.image_url} alt={profile.name} />
                                        <AvatarFallback className="capitalize"> {profile.name?.charAt(0)} </AvatarFallback>
                                    </Avatar>
                                    <h4 className="text-sm font-bold truncate">{profile.name}</h4>
                                    <EllipsisVertical className="ml-auto"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="mb-2" side={isMobile ? 'bottom' : 'top'} align="start" sideOffset={0}>
                                <DropdownMenuLabel> 
                                    <div className="w-52 p-1.5 flex items-center gap-3">
                                        <Avatar className="w-8 h-8 rounded-full">
                                            <AvatarImage src={profile.image_url} alt={profile.name}/>
                                            <AvatarFallback className="capitalize"> {profile.name?.charAt(0)} </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="text-sm font-bold truncate">{profile.name}</h4>
                                            <p className="text-xs italic">{profile.role}</p>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                
                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <CircleUserRound /> <span> Account </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <ShoppingCart /> <span> Billing </span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>signOut()}>
                                        <LogOut/> <span> Sign Out </span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

        </Sidebar>
    )
}