'use client'
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function PageContentSuccess() {
    const supabase = createClient();
    const seacrhParams = useSearchParams();
    const order_id = seacrhParams.get('order_id');

    const { mutate, isPending, isSuccess, isError } = useMutation({
        mutationKey: ['mutateUpdateStatusOrder', order_id],
        mutationFn: async () => {
            if (!order_id) throw new Error("order_id tidak ada di URL");
            
            // get data and update status from orders
            const { data: orders, error } = await supabase
                .from('orders')
                .update({status: 'settled'})
                .eq('order_id', order_id)
                .select()
                .single()
            ;
            console.log(orders)

            if (orders.payment_token === null) {
                throw new Error("Payment token is null");
            }
            if (orders) {
                await supabase
                    .from('tables')
                    .update({status: 'available'})
                    .eq('id', orders.table_id)
                ;
            }
        },
    });

    useEffect(() => {
        if (order_id) {
            mutate();
        }
    }, [order_id, mutate]);

    
    return(
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            {/* AMBIL DATA ID DARI URL*/}
            {/* https://example.com/payment/success/?order_id=QACHLESS-202508012218&status_code=200&transaction_status=settlement */}
            
            <div className="flex items-center gap-2">
                {(isSuccess) && (
                    <>
                        <CheckCircle color="#00ff00" size={30} />
                        <p className='text-2xl font-bold'> Payment successful </p>
                    </>
                )}
                {isPending && (
                    <p className='text-lg'> Processing payment... </p>
                )}
                {isError && (
                    <p className='text-lg text-red-500'> Gagal update status pembayaran. </p>
                )}
            </div>
            <Link href="/dashboard/order">
                <Button className='cursor-pointer' variant={'outline'}> Back to order </Button>
            </Link>
        </div>
    )
}