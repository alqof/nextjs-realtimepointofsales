'use client'
import { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideClockFading, Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import TableUser from "@/app/(dashboard)/admin/user/_components/table-user";
import DropdownAction from "@/app/(dashboard)/admin/user/_components/dropdown-action";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import DialogCreateUser from "./_components/dialog-create-user";
import { profileState } from "@/lib/types";
import DialogUpdateUser from "./_components/dialog-update-user";
import DialogDeleteUser from "./_components/dialog-delete-user";


export const HEADER_TABLE_USER = ['No', 'ID', 'Name', 'Role', 'Action'];
export const LIMIT_LIST = [5, 10, 25, 50, 100];
export const DEFAULT_LIMIT = LIMIT_LIST[0];
export const DEFAULT_PAGE = 1;

// Hooks Table
function useTable() {
    const debounce = useDebounce();
    const [currentSearh, setCurrentSearch] = useState('')
    const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

    const handleChangeSearh = (search: string)=>{
        debounce(()=>{
            setCurrentSearch(search);
            setCurrentPage(DEFAULT_PAGE);
        }, 500)
    }
    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    }
    const handleChangeLimit = (limit: number) => {
        setCurrentLimit(limit);
        setCurrentPage(DEFAULT_PAGE);
    }

    return{ currentSearh, handleChangeSearh, currentPage, handleChangePage, currentLimit, handleChangeLimit }
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

export default function useManagementPage(){
    const supabase = createClient();
    
    const { currentSearh, handleChangeSearh, currentPage, handleChangePage, currentLimit, handleChangeLimit } = useTable();
    const { data:users, isLoading, refetch } = useQuery({
        queryKey: ['users', currentSearh, currentPage, currentLimit],
        queryFn: async()=>{
            const result = await supabase
                .from('profiles')
                .select('*', {count: 'exact'})
                .range(((currentPage-1) * currentLimit), (currentPage*currentLimit-1)) // page=1; limit=10; range=(0, 9)
                .order('created_at')
                .ilike('name', `${currentSearh}%`);

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

    const [selectedAction, setSelectedAction] = useState<{data: profileState, type: 'update'|'delete'} | null>();
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
                <DropdownAction
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
                                {LIMIT_LIST.map((limit)=>(
                                    <SelectItem key={limit} value={limit.toString()}> {limit} </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* SEARCH */}
                    <Input className="w-full" placeholder="Search...." onChange={(e)=>handleChangeSearh(e.target.value)}/>
                </div>

                {/* CREATE USER */}
                <Dialog>
                    <DialogTrigger asChild className="cursor-pointer">
                        <Button variant="outline"> <Plus/> Create </Button>
                    </DialogTrigger>

                    <DialogCreateUser refetch={refetch}/>
                </Dialog>
            </div>

            {/* TABLE */}
            <TableUser isLoading={isLoading} header={HEADER_TABLE_USER} data={filteredData} totalPages={totalPages} currentPage={currentPage} currentLimit={currentLimit} onChangePage={handleChangePage} onChangeLimit={handleChangeLimit} />

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