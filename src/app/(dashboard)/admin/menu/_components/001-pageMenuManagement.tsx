"use client";
import { Metadata } from 'next'
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { TABLE_DEFAULT_LIMIT, TABLE_DEFAULT_PAGE, TABLE_HEADER_MENU, TABLE_LIMIT_LIST } from '@/lib/constants/dashboard-constant';
import React, { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner';
import { Check, ImageOff, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { menuSchemaValidation } from '@/lib/validations/menu-validation';
import { cn, convertIDR } from '@/lib/utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DropdownAction from '../../../../../components/table-dropdown-action-set';
import TableSet from '@/components/table-set';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DialogCreateMenu from './dialog-create-menu';
import DialogUpdateMenu from './dialog-update-menu';
import DialogDeleteMenu from './dialog-delete-menu';


export const metadata: Metadata = {
    title: 'QopzKuy | Menu'
}

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

export default function PageMenuManagement() {
    const supabase = createClient();
        
    const { currentSearch, handleChangeSearh, currentPage, handleChangePage, currentLimit, handleChangeLimit } = useTable();
    const { data:menus, isLoading, refetch } = useQuery({
        queryKey: ['menus', currentSearch, currentPage, currentLimit],
        queryFn: async()=>{
            const query = supabase
                .from('menus')
                .select('*', { count: 'exact' })
                .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
                .order('category', { ascending: true })
                .order('name', { ascending: true });

            if(currentSearch) {
                query.or(`name.ilike.%${currentSearch}%,category.ilike.%${currentSearch}%`);
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
                    { description: "Get menu data failed." }
                )
            }

            return result;
        }
    })

    const [selectedAction, setSelectedAction] = useState<{
        data: menuSchemaValidation, 
        type: 'update'|'delete'
    } | null>();
    
    const handleChangeAction = (open: boolean) => {
        if(!open) setSelectedAction(null);
    }

    const filteredData = useMemo(() => {
        return (menus?.data || []).map((menu: menuSchemaValidation, index) => {
            return [
                currentLimit * (currentPage-1) + index + 1,
                <div className='flex items-center gap-2'>
                    <div>
                        {menu.image_url ? (
                            <Avatar className="w-12 h-12 rounded-lg shadow-md">
                                <AvatarImage src={menu.image_url as string} alt="preview" className="object-cover"/>
                                <AvatarFallback className="rounded-lg w-full h-full flex items-center justify-center">
                                    {/* <ImageOff className="w-2/3 h-2/3"/> */}
                                    <Loader2 className='animate-spin'/>
                                </AvatarFallback>
                            </Avatar>
                        ): (
                            <ImageOff className="w-12 h-12 mb-2 rounded-lg shadow-md" />
                        )}
                    </div>
                    <p className='break-words whitespace-normal'> {menu.name} </p>
                </div>,
                <span className="italic"> {menu.category} </span>,
                <div>
                    <p>Base: {convertIDR(menu.price)}</p>
                    <p>Discount: {menu.discount}</p>
                    <p>After Discount: {convertIDR(menu.price - (menu.price * menu.discount) / 100)}</p>
                </div>,
                <div className={cn('w-fit px-2 py-1 rounded-full', menu.is_available ? 'bg-green-600' : 'bg-red-600')}>
                    <span className="text-white text-shadow-md"> {menu.is_available ? <Check size={12}/> : <X size={12}/>} </span>
                    {/* <span className="font-bold text-xs text-white text-shadow-lg"> {menu.is_available ? 'Available' : 'Not Available'} </span> */}
                </div>,
                <DropdownAction
                    menu={[
                        {
                            label: (<span className="flex item-center gap-2"> <Pencil /> Edit </span>),
                            action: () => {
                                setSelectedAction({
                                    data: menu,
                                    type: 'update'
                                })
                            },
                        },
                        {
                            label: (<span className="flex item-center gap-2"> <Trash2 className="text-red-400" /> Delete </span>),
                            variant: 'destructive',
                            action: () => {
                                setSelectedAction({
                                    data: menu,
                                    type: 'delete'
                                })
                            },
                        },
                    ]}
                />,
            ];
        });
    }, [menus]);

    const totalPages = useMemo(() => {
        return (
            menus && 
            menus.count!==null ? Math.ceil(menus.count/currentLimit) : 0
        )
    }, [menus, currentLimit])


    return(
        <div className="w-full">
            <h1 className="mb-6 text-2xl text-green-800 dark:text-green-200 font-bold"> Menu Management </h1>

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
                    <Input className="w-full" placeholder="Search by name or category ... " onChange={(e)=>handleChangeSearh(e.target.value)}/>
                </div>

                {/* CREATE USER */}
                <Dialog>
                    <DialogTrigger asChild className="cursor-pointer">
                        <Button variant="outline"> <Plus/> Create </Button>
                    </DialogTrigger>

                    <DialogCreateMenu refetch={refetch}/>
                </Dialog>
            </div>

            {/* TABLE */}
            <TableSet isLoading={isLoading} header={TABLE_HEADER_MENU} data={filteredData} totalPages={totalPages} currentPage={currentPage} currentLimit={currentLimit} onChangePage={handleChangePage} onChangeLimit={handleChangeLimit} />

            {/* Dialog Content */}
            <DialogUpdateMenu 
                refetch={refetch}
                currentData={selectedAction?.data}
                open={selectedAction!==null && selectedAction?.type==='update'}
                handleChangeAction={handleChangeAction}
            />
            <DialogDeleteMenu
                refetch={refetch}
                currentData={selectedAction?.data}
                open={selectedAction!==null && selectedAction?.type==='delete'}
                handleChangeAction={handleChangeAction}
            />
        </div>
    )
}