import { Armchair, LayoutDashboard, SquareMenu, ShoppingCart, Users } from "lucide-react";

// SIDEBAR MENU
export const SIDEBAR_MENU = {
    admin: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: 'Order',
            url: '/dashboard/order',
            icon: ShoppingCart,
        },
        {
            title: 'Menu',
            url: '/dashboard/menu',
            icon: SquareMenu,
        },
        {
            title: 'Table',
            url: '/dashboard/table',
            icon: Armchair,
        },
        {
            title: 'User',
            url: '/dashboard/user',
            icon: Users,
        },
    ],
    cashier: [
        {
            title: 'Order',
            url: '/dashboard/order',
            icon: ShoppingCart,
        },
        {
            title: 'Menu',
            url: '/dashboard/menu',
            icon: SquareMenu,
        },
        {
            title: 'Table',
            url: '/dashboard/table',
            icon: Armchair,
        },
    ],
    kitchen: [
        {
            title: 'Order',
            url: '/dashboard/order',
            icon: ShoppingCart,
        },
    ],
}
export type SidebarMenuKey = keyof typeof SIDEBAR_MENU;

// TABLE
export const TABLE_HEADER_USER = ['No', 'ID', 'Name', 'Role', 'Action'];
export const TABLE_HEADER_MENU = ['No', 'Name', 'Category', 'Price', 'Availability', 'Action'];
export const TABLE_HEADER_TABLE = ['No',  'Name', 'Description', 'Capacity', 'Status', 'Action'];
export const TABLE_HEADER_ORDER = ['No', 'Order ID', 'Customer Name', 'Table', 'Status', 'Action'];
export const TABLE_HEADER_ORDER_DETAIL = ['No', 'Menu', 'Total', 'Status', 'Action'];
export const TABLE_LIMIT_LIST = [5, 10, 25, 50, 100];
export const TABLE_DEFAULT_LIMIT = TABLE_LIMIT_LIST[1];
export const TABLE_DEFAULT_PAGE = 1;





// STATE
export const INITIAL_ACTION_STATE = {
    status: 'idle',
    errors: { _form: [] }
}
