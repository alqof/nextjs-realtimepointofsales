import { Album, Armchair, LayoutDashboard, SquareMenu, Users } from "lucide-react";

export const SIDEBAR_MENU = {
    admin: [
        {
            title: 'Dashboard',
            url: '/admin',
            icon: LayoutDashboard,
        },
        {
            title: 'Order',
            url: '/admin/order',
            icon: Album,
        },
        {
            title: 'Menu',
            url: '/admin/menu',
            icon: SquareMenu,
        },
        {
            title: 'Table',
            url: '/admin/table',
            icon: Armchair,
        },
        {
            title: 'User',
            url: '/admin/user',
            icon: Users,
        },
    ],
}

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU;