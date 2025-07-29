import { Album, Armchair, LayoutDashboard, SquareMenu, Users } from "lucide-react";

// SIDEBAR MENU
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

// TABLE
export const TABLE_HEADER_USER = ['No', 'ID', 'Name', 'Role', 'Action'];
export const TABLE_LIMIT_LIST = [5, 10, 25, 50, 100];
export const TABLE_DEFAULT_LIMIT = TABLE_LIMIT_LIST[0];
export const TABLE_DEFAULT_PAGE = 1;
export const TABLE_HEADER_MENU = ['No', 'Name', 'Category', 'Price', 'Available', 'Action'];
