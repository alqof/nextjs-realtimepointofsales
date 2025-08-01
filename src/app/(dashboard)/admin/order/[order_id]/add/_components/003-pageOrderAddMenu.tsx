'use client'
import { startTransition, useActionState, useRef, useState } from "react";
import { INITIAL_ACTION_STATE, TABLE_DEFAULT_PAGE } from "@/lib/constants/general-constant";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INITIAL_FILTER_MENU } from "@/lib/constants/order-constant";
import { Loader2 } from "lucide-react";
import CardListMenu from "./card-list-menu";
import CartInformation from "./cart";
import { cartState } from "@/lib/types";
import { menuSchemaValidation } from "@/lib/validations/validation-menu";
import Cart from "./cart";
import { actionAddMenuOrder } from "@/lib/actions/action-order";


// Hooks Table
function useTable() {
    const debounce = useDebounce();
    const [currentSearch, setCurrentSearch] = useState('')
    const [currentFilter, setCurrentFilter] = useState('');
    // const [currentPage, setCurrentPage] = useState(TABLE_DEFAULT_PAGE);


    const handleChangeSearch = (search: string)=>{
        debounce(()=>{
            setCurrentSearch(search);
            // setCurrentPage(TABLE_DEFAULT_PAGE);
        }, 500)
    }
    const handleChangeFilter = (filter: string) => {
        setCurrentFilter(filter);
        setCurrentSearch('');
        // setCurrentPage(TABLE_DEFAULT_PAGE);
    };


    return{ currentSearch, currentFilter, handleChangeSearch, handleChangeFilter };
}
// Hooks Debounce
function useDebounce() {
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
    const debounce = (
        func: ()=>void, 
        delay: number,
    ) => {
        if(debounceTimeout.current) 
            clearTimeout(debounceTimeout.current)

        debounceTimeout.current = setTimeout(()=>{
            func();
            debounceTimeout.current = null;
        }, delay)
    }

    return debounce;
}

export default function PageOrderAddMenu({order_id}: {order_id: string}) {
    const { currentSearch, currentFilter, handleChangeSearch, handleChangeFilter } = useTable();
    
    const supabase = createClient();
    const { data: menus, isLoading } = useQuery({ //get data menus
        queryKey: ['menus', currentSearch, currentFilter],
        queryFn: async () => {
            const query = supabase
                .from('menus')
                .select('*', { count: 'exact' })
                .order('category')
                .order('name')
                .eq('is_available', true)
                .ilike('name', `${currentSearch}%`)
            ;

            if (currentFilter) {
                query.eq('category', currentFilter);
            }

            const result = await query;
            if (result.error){
                toast(
                    <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                            <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                        </svg>
                        Get menu failed!
                    </span>,
                    {description: result.error.message}
                )
            }

            return result;
        },
    });
    const { data: orders } = useQuery({ //get data orders
        queryKey: ['order', order_id],
        queryFn: async () => {
            const result = await supabase
                .from('orders')
                .select('id, customer_name, status, payment_token, tables (name, id)')
                .eq('order_id', order_id)
                .single()
            ;

            if (result.error){
                toast(
                    <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                            <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                        </svg>
                        Get order failed!
                    </span>,
                    {description: result.error.message}
                )
            }

            return result.data;
        },
        enabled: !!order_id,
    });

    const [carts, setCarts] = useState<cartState[]>([]);
    const handleAddToCart = (menu: menuSchemaValidation, action: 'increment'|'decrement') => {
        const existingItem = carts.find((item) => item.menu_id===menu.id);
        if (existingItem) {
            if (action==='increment') {
                setCarts(
                    carts.map((item) => item.menu_id===menu.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            total: item.total + menu.price,
                        } : item,
                    ),
                );
            } else {
                if (existingItem.quantity > 1) {
                    setCarts(
                        carts.map((item) => item.menu_id===menu.id
                            ? {
                                ...item,
                                quantity: item.quantity - 1,
                                total: item.total - menu.price,
                            } : item,
                        ),
                    );
                } else {
                    setCarts(carts.filter((item) => item.menu_id!==menu.id));
                }
            }
        } else {
            setCarts([
                ...carts,
                { 
                    menu_id: menu.id, 
                    menu,
                    quantity: 1, 
                    notes: '', 
                    total: menu.price, 
                },
            ]);
        }
    };

    const [addMenuOrderState, addMenuOrderAction, isPendingaddMenuOrder] = useActionState(actionAddMenuOrder, INITIAL_ACTION_STATE);
    const handleAddMenuOrder = async ()=>{
        const data = {
            order_id: order_id,
            items: carts.map((item) => ({
                ...item,
                order_id: orders?.id ?? '',
                status: 'pending',
            })),
        };

        startTransition(() => {
            addMenuOrderAction(data);
        });
    };




    return (
        <div className="w-full">
            <h1 className="mb-6 text-2xl text-green-800 dark:text-green-200 font-bold"> Menu </h1>

            <div className="w-full flex flex-col lg:flex-row gap-4">
                <div className="space-y-4 lg:w-2/3">
                    <div className="flex flex-col items-center justify-between gap-4 w-full lg:flex-row">
                        <div className="flex flex-col lg:flex-row items-center gap-4">
                            <div className="flex gap-2">
                                {INITIAL_FILTER_MENU.map((item) => (
                                    <Button className="cursor-pointer" key={item.value} onClick={() => handleChangeFilter(item.value)} variant={currentFilter === item.value ? 'default' : 'outline'} >
                                        {item.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Input placeholder="Search..." onChange={(e) => handleChangeSearch(e.target.value)} />
                    </div>
                    
                    {isLoading && !menus ? (
                        <div className="w-full h-full p-10 flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin" color="#16a34a" size={30} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-4">
                            {menus?.data?.map((menu) => (
                                <CardListMenu key={`menu-${menu.id}`} menu={menu} handleAddToCart={handleAddToCart} />
                            ))}
                        </div>
                    )}

                    {!isLoading && menus?.data?.length===0 && (
                        <div className="text-center w-full"> Menu not found </div>
                    )}
                </div>

                <div className="lg:w-1/3">
                    <Cart order={orders} carts={carts} setCarts={setCarts} handleAddToCart={handleAddToCart} handleAddMenuOrder={handleAddMenuOrder} isLoading={isLoading} />
                </div>
            </div>
        </div>
    )
}