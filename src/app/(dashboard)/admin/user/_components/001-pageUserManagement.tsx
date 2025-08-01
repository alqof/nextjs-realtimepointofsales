'use client'
import { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideClockFading, Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { profileState } from "@/lib/types";
import DialogCreateUser from "./dialog-create-user";
import DialogUpdateUser from "./dialog-update-user";
import DialogDeleteUser from "./dialog-delete-user";
import { TABLE_DEFAULT_LIMIT, TABLE_DEFAULT_PAGE, TABLE_HEADER_USER, TABLE_LIMIT_LIST } from "@/lib/constants/general-constant";
import TableSet from "@/components/table-set";
import TableColumnDropdownAction from "@/components/table-dropdown-action-set";


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

export default function PageUserManagement(){
    const supabase = createClient();
    
    const { currentSearch, handleChangeSearh, currentPage, handleChangePage, currentLimit, handleChangeLimit } = useTable();
    const { data:users, isLoading, refetch } = useQuery({
        queryKey: ['users', currentSearch, currentPage, currentLimit],
        queryFn: async()=>{
            const result = await supabase
                .from('profiles')
                .select('*', {count: 'exact'})
                .range(((currentPage-1) * currentLimit), (currentPage*currentLimit-1)) // page=1; limit=10; range=(0, 9)
                .order('created_at')
                .ilike('name', `${currentSearch}%`);

            if(result.error){
                toast(
                    <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                            <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                        </svg>
                        {result.error.message}
                    </span>,
                    { description: "Get user data failed." }
                )
            }

            return result;
        }
    })

    const [selectedAction, setSelectedAction] = useState<{
        data: profileState, 
        type: 'update'|'delete'
    } | null>();

    const handleChangeAction = (open: boolean) => {
        if(!open) setSelectedAction(null);
    }

    const filteredData = useMemo(() => {
        return (users?.data || []).map((user, index) => {
            return [
                currentLimit * (currentPage-1) + index + 1,
                user.id, 
                user.name, 
                user.role, 
                <TableColumnDropdownAction
                    menu={[
                        {
                            label: (<span className="flex item-center gap-2"> <Pencil /> Edit </span>),
                            action: () => {
                                setSelectedAction({
                                    data: user,
                                    type: 'update'
                                })
                            },
                        },
                        {
                            label: (<span className="flex item-center gap-2"> <Trash2 className="text-red-400" /> Delete </span>),
                            variant: 'destructive',
                            action: () => {
                                setSelectedAction({
                                    data: user,
                                    type: 'delete'
                                })
                            },
                        },
                    ]}
                />,
            ];
        });
    }, [users]);
    const totalPages = useMemo(() => {
        return ( users && users.count!==null ? Math.ceil(users.count/currentLimit) : 0)
    }, [users, currentLimit])


    return(
        <div className="w-full">
            <h1 className="mb-6 text-2xl text-green-800 dark:text-green-200 font-bold"> User Management </h1>

            <div className="w-full mb-2 flex flex-col lg:flex-row justify-between gap-2">
                <div className="flex w-full gap-2">
                    {/* LIMIT */}
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
                    <Input className="w-full" placeholder="Search name ..." onChange={(e)=>handleChangeSearh(e.target.value)}/>
                </div>

                {/* CREATE */}
                <Dialog>
                    <DialogTrigger asChild className="cursor-pointer">
                        <Button variant="outline"> <Plus/> Create </Button>
                    </DialogTrigger>

                    <DialogCreateUser refetch={refetch}/>
                </Dialog>
            </div>

            {/* TABLE */}
            <TableSet isLoading={isLoading} header={TABLE_HEADER_USER} data={filteredData} totalPages={totalPages} currentPage={currentPage} currentLimit={currentLimit} onChangePage={handleChangePage} onChangeLimit={handleChangeLimit} />

            {/* Dialog Content */}
            <DialogUpdateUser 
                refetch={refetch}
                currentData={selectedAction?.data}
                open={selectedAction!==null && selectedAction?.type==='update'}
                handleChangeAction={handleChangeAction}
            />
            <DialogDeleteUser
                refetch={refetch}
                currentData={selectedAction?.data}
                open={selectedAction!==null && selectedAction?.type==='delete'}
                handleChangeAction={handleChangeAction}
            />
        </div>
    )
}