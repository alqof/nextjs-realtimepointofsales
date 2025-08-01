"use client";
import React, { startTransition, useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Ban, Link2Icon, Pencil, Plus, ScrollText, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DropdownAction from '../../../../../components/table-dropdown-action-set';
import TableSet from '@/components/table-set';
import { tableSchemaValidation } from '@/lib/validations/validation-table';
import { cn } from '@/lib/utils';
import DialogCreateOrder from './dialog-create-order';
import { actionUpdateReservation } from '@/lib/actions/action-order';
import Link from 'next/link';
import { INITIAL_ACTION_STATE, TABLE_DEFAULT_LIMIT, TABLE_DEFAULT_PAGE, TABLE_HEADER_ORDER, TABLE_LIMIT_LIST } from '@/lib/constants/general-constant';
import TableColumnDropdownAction from '../../../../../components/table-dropdown-action-set';


// Hooks Table
function useTable() {
    const debounce = useDebounce();
    const [currentSearch, setCurrentSearch] = useState('')
    const [currentLimit, setCurrentLimit] = useState(TABLE_DEFAULT_LIMIT);
    const [currentPage, setCurrentPage] = useState(TABLE_DEFAULT_PAGE);

    const handleChangeSearh = (search: string)=>{
        debounce(()=>{
            setCurrentSearch(search);
            setCurrentPage(TABLE_DEFAULT_PAGE);
        }, 500)
    }
    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    }
    const handleChangeLimit = (limit: number) => {
        setCurrentLimit(limit);
        setCurrentPage(TABLE_DEFAULT_PAGE);
    }

    return{ currentSearch, handleChangeSearh, currentPage, handleChangePage, currentLimit, handleChangeLimit }
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

export default function PageOrderManagement() {
    const { currentSearch, handleChangeSearh, currentPage, handleChangePage, currentLimit, handleChangeLimit } = useTable();

    const supabase = createClient();
    const { data: orders, isLoading, refetch: refetchOrders } = useQuery({ //get data from orders
        queryKey: ['orders', currentSearch, currentPage, currentLimit],
        queryFn: async()=>{
            const query = supabase
                .from('orders')
                .select('id, order_id, customer_name, status, tables(name, id)', { count: 'exact' })
                .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
                .order('created_at', { ascending: true })
            ;

            if (currentSearch) {
                query.or(`order_id.ilike.%${currentSearch}%,customer_name.ilike.${currentSearch}%`);
            }

            const result = await query;
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
        }
    })
    const { data: tables, refetch: refetchTables } = useQuery({ //get data from tables
        queryKey: ['tables'],
        queryFn: async () => {
            const result = await supabase
                .from('tables')
                .select('*')
                .order('status', { ascending: true })
                .order('name', { ascending: true })
            ;
            return result.data;
        },
    });

    // HANDLE ACTION untuk order status reserve (process, cancel)
    const [updateReservationState, updateReservationAction] = useActionState(actionUpdateReservation, INITIAL_ACTION_STATE);
    const handleReservation = async (
        {
            id,
            table_id,
            status,
        } : {
            id: string;
            table_id: string;
            status: string;
        }
    ) => {
        const formData = new FormData;
        Object.entries({id, table_id, status}).forEach(([key, value]) => {
            formData.append(key, value)
        })
        
        startTransition(() => {
            updateReservationAction(formData)
        })
    };

    useEffect(()=>{
        if(updateReservationState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    Update Reservation Failed
                </span>,
                {description: updateReservationState.errors?._form?.[0]}
            )
        }
        if(updateReservationState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Update Reservation Success
                </span>,
            );
            refetchOrders();
            refetchTables();
        }
    }, [updateReservationState])
    
    const reservedActionList = [
        {
            label: (<span className="flex items-center gap-2"> <Link2Icon /> Process </span>),
            action: (id: string, table_id: string) => {
                handleReservation({ id, table_id, status: 'process' });
            },
        },
        {
            label: (<span className="flex items-center gap-2"> <Ban className="text-red-500" /> Cancel </span>),
            action: (id: string, table_id: string) => {
                handleReservation({ id, table_id, status: 'canceled' });
            },
        },
    ];


    const filteredData = useMemo(() => {
        return (orders?.data || []).map((order, index) => {
            return [
                currentLimit * (currentPage-1) + index + 1,
                order.order_id,
                order.customer_name,
                (order.tables as unknown as { name: string }).name,
                <div className={cn('px-2 py-1 rounded-full text-white w-fit capitalize', {
                        'bg-lime-600': order.status === 'settled',
                        'bg-sky-600': order.status === 'process',
                        'bg-amber-600': order.status === 'reserved',
                        'bg-red-600': order.status === 'canceled',
                    })}
                >
                    {order.status}
                </div>,
                <TableColumnDropdownAction
                    menu={ order.status==='reserved'
                        ? reservedActionList.map((item) => ({
                            label: item.label,
                            action: () =>
                                item.action(order.id, (order.tables as unknown as { id: string }).id)
                            }))
                        : [{
                            label: (
                                <Link href={`/admin/order/${order.order_id}`} className="flex items-center gap-2">
                                    <ScrollText /> Detail
                                </Link>
                            ),
                            type: 'link',
                        }]
                    }
                />,
            ];
        });
    }, [orders]);

    const totalPages = useMemo(() => {
        return (
            orders && 
            orders.count!==null ? Math.ceil(orders.count/currentLimit) : 0
        )
    }, [orders, currentLimit])


    return(
        <div className="w-full">
            <h1 className="mb-6 text-2xl text-green-800 dark:text-green-200 font-bold"> Order Management </h1>

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

                    {/* SEARCH */}
                    <Input className="w-full" placeholder="Search by name, description, capacity, status... " onChange={(e)=>handleChangeSearh(e.target.value)}/>
                </div>

                {/* CREATE */}
                <Dialog>
                    <DialogTrigger asChild className="cursor-pointer">
                        <Button variant="outline"> <Plus/> Add Order </Button>
                    </DialogTrigger>

                    <DialogCreateOrder refetchOrders={refetchOrders} refetchTables={refetchTables} tables={tables}/>
                </Dialog>
            </div>

            {/* TABLE */}
            <TableSet isLoading={isLoading} header={TABLE_HEADER_ORDER} data={filteredData} totalPages={totalPages} currentPage={currentPage} currentLimit={currentLimit} onChangePage={handleChangePage} onChangeLimit={handleChangeLimit} />
        </div>
    )
}