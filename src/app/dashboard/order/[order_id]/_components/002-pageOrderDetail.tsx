'use client';
import TableSet from "@/components/table-set";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INITIAL_ACTION_STATE, TABLE_DEFAULT_LIMIT, TABLE_DEFAULT_PAGE, TABLE_HEADER_ORDER_DETAIL, TABLE_LIMIT_LIST } from "@/lib/constants/general-constant";
import { createClient } from "@/lib/supabase/client";
import { cn, convertIDR } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCheck, ImageOff, Loader2, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import SummaryOrderDetail from "./summaryOrderDetail";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { actionUpdateStatusOrder } from "@/lib/actions/action-order";
import { useAuthStore } from "@/lib/store/auth-store";
import { createClientRealtime } from "@/lib/supabase/realtime";


// Hooks Table
function useTable() {
    const [currentLimit, setCurrentLimit] = useState(TABLE_DEFAULT_LIMIT);
    const [currentPage, setCurrentPage] = useState(TABLE_DEFAULT_PAGE);

    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    }
    const handleChangeLimit = (limit: number) => {
        setCurrentLimit(limit);
        setCurrentPage(TABLE_DEFAULT_PAGE);
    }

    return{ currentPage, handleChangePage, currentLimit, handleChangeLimit }
}

export default function PageOrderDetail({order_id}: {order_id: string}) {
    const profile = useAuthStore((state) => state.profile);
    const { currentPage, handleChangePage, currentLimit, handleChangeLimit } = useTable();

    const supabase = createClientRealtime();
    const { data: orders } = useQuery({ //get data from orders
        queryKey: ['orders', order_id],
        queryFn: async()=>{
            const result = await supabase
                .from('orders')
                .select('id, customer_name, status, payment_token, tables(name, id)', { count: 'exact' })
                .eq('order_id', order_id)
                .single()
            ;

            if(result.error){
                toast(
                    <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                            <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                        </svg>
                        {result.error.message}
                    </span>,
                    { description: "Get table data failed." }
                )
            }

            return result;
        },
        enabled: !!order_id, //jalankan query ini jika ada order_id nya
    })
    const { data: ordersMenus, isLoading, refetch: refetchOrdersMenus } = useQuery({
        queryKey: ['orders_menus', orders?.data?.id, currentPage, currentLimit],
        queryFn: async () => {
            const result = await supabase
                .from('orders_menus')
                .select('*, menus(id, name, image_url, price)', { count: 'exact' })
                .eq('order_id', orders?.data?.id)
                .order('status')
            ;
            if (result.error){
                toast.error('Get order menu data failed', {
                    description: result.error.message,
                });
            }

            return result;
        },
        enabled: !!orders?.data?.id,
    });

    useEffect(() => {
        if (!orders?.data?.id) return;
        const channel = supabase
            .channel('change-order')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders_menus',
                    filter: `order_id=eq.${orders.data.id}`,
                },
                () => { refetchOrdersMenus() },
            )
            .subscribe()
        ;

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orders?.data?.id]);


    const [updateStatusOrderState, updateStatusOrderAction] = useActionState(actionUpdateStatusOrder, INITIAL_ACTION_STATE);
    const handleUpdateStatusOrder = async (data: {id: string; status: string;}) => {
        const formData = new FormData();
            Object.entries(data).forEach(([Key, value]) => {
            formData.append(Key, value);
        });

        startTransition(() => {
            updateStatusOrderAction(formData);
        });
    };

    useEffect(() => {
        if (updateStatusOrderState?.status === 'error') {
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    Update Status Order Failed
                </span>,
                {description: updateStatusOrderState.errors?._form?.[0]}
            )
        }
        if (updateStatusOrderState?.status==='success') {
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Update Status Order Success
                </span>
            );
            refetchOrdersMenus();
        }
    }, [updateStatusOrderState]);


    const filteredData = useMemo(() => {
        return (ordersMenus?.data || []).map((item, index) => {
            return [
                currentLimit * (currentPage-1) + index + 1,
                <div className="flex items-center gap-2">
                    {item.menus.image_url ? (
                            <Avatar className="w-12 h-12 rounded-lg shadow-md">
                                <AvatarImage src={item.menus.image_url as string} alt="preview" className="object-cover"/>
                                <AvatarFallback className="rounded-lg w-full h-full flex items-center justify-center">
                                    <Loader2 className='animate-spin'/>
                                </AvatarFallback>
                            </Avatar>
                        ): (
                            <ImageOff className="w-12 h-12 mb-2 rounded-lg shadow-md" />
                        )
                    }
                    <div className="flex flex-col">
                        <p> {item.menus.name} <span className="ml-2 px-2 py-1 bg-zinc-300 rounded-md text-black text-xs font-bold">{item.quantity}x</span> </p>
                        <span className="text-xs text-muted-foreground"> {item.notes || '-'} </span>
                    </div>
                </div>,
                <div>{convertIDR(item.menus.price * item.quantity)}</div>,
                <div className={cn('w-fit px-2 py-1 rounded-full', 
                    {'bg-gray-500': item.status === 'pending',
                    'bg-yellow-500': item.status === 'process',
                    'bg-blue-500': item.status === 'ready',
                    'bg-green-500': item.status === 'served',}
                )}>
                    <span className="font-bold text-xs text-white text-shadow-lg"> {item.status} </span>
                </div>,
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {item.status!=='served' ? (
                            <Button variant="ghost" className='data-[state=open]:bg-muted size-8 cursor-pointer' size="icon">
                                <Settings />
                            </Button>
                        ): (
                            <Button variant="secondary" className="size-8 pointer-events-none" size="icon">
                                <CheckCheck />
                            </Button>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        {['pending', 'process', 'ready'].map((status, index) => {
                            const statusOrder = ['process', 'ready', 'served'][index];
                            return (
                                item.status === status && (
                                    <DropdownMenuItem key={status} className="capitalize" onClick={() => handleUpdateStatusOrder({ id: item.id, status: statusOrder })}>
                                        {statusOrder}
                                    </DropdownMenuItem>
                                )
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>,
            ];
        });
    }, [ordersMenus?.data]);

    const totalPages = useMemo(() => {
        return (
            ordersMenus && 
            ordersMenus.count!==null ? Math.ceil(ordersMenus.count/currentLimit) : 0
        )
    }, [ordersMenus, currentLimit])

    return(
        <div className="w-full">
            <h1 className="mb-6 text-2xl text-green-800 dark:text-green-200 font-bold"> Order detail </h1>

            <div className="w-full mb-2 flex flex-col lg:flex-row justify-between gap-2">
                <div className="flex w-full gap-2">
                    {/* <Label> Limit </Label> */}
                    <Select value={currentLimit.toString()} onValueChange={(value)=>handleChangeLimit(Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Limit"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Limit</SelectLabel>
                                {TABLE_LIMIT_LIST.map((limit)=>(
                                    <SelectItem key={limit} value={limit.toString()}> {limit} </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Add Menu */}
                {profile.role!=='kitchen' && (
                    <Link href={`/dashboard/order/${order_id}/add`}>
                        <Button className="cursor-pointer" variant="outline"> <Plus/> Add menu Item </Button>
                    </Link>
                )}
            </div>

            <div className="flex gap-4">
                {profile.role=='kitchen' ? (
                    <div className="w-full">
                        <TableSet isLoading={isLoading} header={TABLE_HEADER_ORDER_DETAIL} data={filteredData} totalPages={totalPages} currentPage={currentPage} currentLimit={currentLimit} onChangePage={handleChangePage} onChangeLimit={handleChangeLimit} />
                    </div>
                ):(
                    <>
                        <div className="w-full">
                            <TableSet isLoading={isLoading} header={TABLE_HEADER_ORDER_DETAIL} data={filteredData} totalPages={totalPages} currentPage={currentPage} currentLimit={currentLimit} onChangePage={handleChangePage} onChangeLimit={handleChangeLimit} />
                        </div>
                        <div className="w-1/3">
                            <SummaryOrderDetail order_id={order_id} orders={orders?.data} ordersMenus={ordersMenus?.data} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}