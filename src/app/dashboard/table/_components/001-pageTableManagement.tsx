"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { TABLE_DEFAULT_LIMIT, TABLE_DEFAULT_PAGE, TABLE_HEADER_TABLE, TABLE_LIMIT_LIST } from '@/lib/constants/general-constant';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TableSet from '@/components/table-set';
import { tableSchemaValidation } from '@/lib/validations/validation-table';
import { cn } from '@/lib/utils';
import DialogCreateTable from './dialog-create-table';
import DialogUpdateTable from './dialog-update-table';
import DialogDeleteTable from './dialog-delete-table';
import TableColumnDropdownAction from '../../../../components/table-dropdown-action-set';
import { useAuthStore } from '@/lib/store/auth-store';



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

export default function PageTableManagement() {
    const profile = useAuthStore((state) => state.profile);
    const supabase = createClient();
    const { currentSearch, handleChangeSearh, currentPage, handleChangePage, currentLimit, handleChangeLimit } = useTable();
    const { data:tables, isLoading, refetch } = useQuery({
        queryKey: ['tables', currentSearch, currentPage, currentLimit],
        queryFn: async()=>{
            const query = supabase
                .from('tables')
                .select('*', { count: 'exact' })
                .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
                .order('name', { ascending: true });

            if(currentSearch) {
                const isNumber = !isNaN(Number(currentSearch));
                if (isNumber) {
                    query.or(`name.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%,capacity.eq.${currentSearch},status.ilike.%${currentSearch}%`);
                } else {
                    query.or(`name.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%,status.ilike.${currentSearch}%`);
                }
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

    useEffect(() => {
        const channel = supabase
            .channel('change-table')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tables',
                },
                () => { refetch() },
            )
            .subscribe()
        ;

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const [selectedAction, setSelectedAction] = useState<{
        data: tableSchemaValidation, 
        type: 'update'|'delete'
    } | null>();
    
    const handleChangeAction = (open: boolean) => {
        if(!open) setSelectedAction(null);
    }

    const filteredData = useMemo(() => {
        return (tables?.data || []).map((table: tableSchemaValidation, index) => {
            return [
                currentLimit * (currentPage-1) + index + 1,
                <span className='font-bold'>{table.name}</span>,
                table.description,
                table.capacity,
                <div className={cn('w-fit px-2 py-1 rounded-full',
                        (table.status==='available' ? 'bg-green-600' : table.status==='unavailable' ? 'bg-red-600' : table.status==='reserved' ? 'bg-orange-600' : 'bg-gray-400')
                    )}
                >
                    <span className="font-bold text-xs text-white text-shadow-lg"> {table.status} </span>
                </div>,
                <TableColumnDropdownAction
                    menu={[
                        {
                            label: (<span className="flex item-center gap-2"> <Pencil /> Edit </span>),
                            action: () => {
                                setSelectedAction({
                                    data: table,
                                    type: 'update'
                                })
                            },
                        },
                        {
                            label: (<span className="flex item-center gap-2"> <Trash2 className="text-red-400" /> Delete </span>),
                            variant: 'destructive',
                            action: () => {
                                setSelectedAction({
                                    data: table,
                                    type: 'delete'
                                })
                            },
                        },
                    ]}
                />,
            ];
        });
    }, [tables]);

    const totalPages = useMemo(() => {
        return (
            tables && 
            tables.count!==null ? Math.ceil(tables.count/currentLimit) : 0
        )
    }, [tables, currentLimit])


    return(
        <div className="w-full">
            <h1 className="mb-6 text-2xl text-green-800 dark:text-green-200 font-bold"> Dining Table Management </h1>

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
                {profile.role=='admin' && (
                    <Dialog>
                        <DialogTrigger asChild className="cursor-pointer">
                            <Button variant="outline"> <Plus/> Create </Button>
                        </DialogTrigger>

                        <DialogCreateTable/>
                    </Dialog>
                )}
            </div>

            {/* TABLE */}
            <TableSet isLoading={isLoading} header={TABLE_HEADER_TABLE} data={filteredData} totalPages={totalPages} currentPage={currentPage} currentLimit={currentLimit} onChangePage={handleChangePage} onChangeLimit={handleChangeLimit} />

            {/* Dialog Content */}
            <DialogUpdateTable 
                currentData={selectedAction?.data}
                open={selectedAction!==null && selectedAction?.type==='update'}
                handleChangeAction={handleChangeAction}
            />
            <DialogDeleteTable
                currentData={selectedAction?.data}
                open={selectedAction!==null && selectedAction?.type==='delete'}
                handleChangeAction={handleChangeAction}
            />
        </div>
    )
}