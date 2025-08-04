import { startTransition, useActionState, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { actionCreateOrder } from "@/lib/actions/action-order";
import { createOrderSchema, createOrderSchemaValidation } from "@/lib/validations/validation-order";
import { INITIAL_DEFAULT_FORM_ORDER, INITIAL_STATE_CREATE_ORDER, INITIAL_STATUS_CREATE_ORDER } from "@/lib/constants/order-constant";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormInputSet from "@/components/form-input-set";
import FormSelectSet from "@/components/form-select-set";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { tableSchemaValidation } from "@/lib/validations/validation-table";

export default function DialogCreateOrder(
    {
        refetchOrders,
        refetchTables,
        tables,
    }: {
        refetchOrders: ()=>void,
        refetchTables: ()=>void,
        tables: tableSchemaValidation[] | null | undefined,
    }
) {
    const formresolve = useForm<createOrderSchemaValidation>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: INITIAL_DEFAULT_FORM_ORDER,
    })
    const onSubmit = formresolve.handleSubmit(async (data) => {
        const formData = new FormData;
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
        })

        startTransition(() => {
            createOrderAction(formData)
        })
    })
    const [createOrderState, createOrderAction, isPendingCreateOrder] = useActionState(actionCreateOrder, INITIAL_STATE_CREATE_ORDER)

    useEffect(()=>{
        if(createOrderState?.status === 'error'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    {createOrderState.errors?._form?.[0]}
                </span>,
            )
        }
        if(createOrderState?.status === 'success'){
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={18} height={18} style={{ marginRight: 4 }}>
                        <circle cx="12" cy="12" r="12" fill="#22c55e"/>
                        <path d="M17 9l-5.2 5.2L7 11.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Ordering Success
                </span>,
            );
            formresolve.reset();
            document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
            refetchOrders();
            refetchTables();
        }
    }, [createOrderState])
    
    return(
        <DialogContent className="sm:max-w-[425px]">
            <Form {...formresolve}>
                <DialogHeader>
                    <DialogTitle> Create Order </DialogTitle>
                    <DialogDescription> Make a new order here </DialogDescription>
                </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="max-h-[70vh] overflow-y-auto p-3 space-y-4">
                            <FormInputSet formresolve={formresolve} label="Customer Name" name="customer_name" type="" placeholder="Customers..." />
                            <FormSelectSet 
                                formresolve={formresolve} 
                                label="Table" 
                                name="table_id" 
                                selectItem={(tables ?? []).map((table: tableSchemaValidation) => (
                                    { 
                                        value: `${table.id}`,
                                        label: `${table.name} - ${table.status}(${table.capacity})`,
                                        disabled: table.status !== 'available'
                                    }
                                ))}
                            />
                            <FormSelectSet formresolve={formresolve} label="Status" name="status" selectItem={INITIAL_STATUS_CREATE_ORDER} /> 
                        </div>

                        <DialogFooter className="flex flex-row items-center justify-end">
                            <DialogClose asChild>
                                <Button className="cursor-pointer" variant="outline"> Cancel </Button>
                            </DialogClose>
                            <Button className="cursor-pointer" type="submit">
                                {isPendingCreateOrder ? <Loader2 className="animate-spin" /> : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
            </Form>
        </DialogContent>
    )
}