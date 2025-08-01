'use client'
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export default function PageContentSuccess() {
    const supabase = createClient();
    const seacrhParams = useSearchParams();
    const order_id = seacrhParams.get('order_id');

    const { mutate } = useMutation({
        mutationKey: ['mutateUpdateStatusOrder'],
        mutationFn: async () => {
            await supabase
                .from('orders')
                .update({status: 'settled'})
                .eq('order_id', order_id)
            ;
        },
    });

    useEffect(() => {
        mutate();
    }, [order_id]);
    

    return(
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            {/* AMBIL DATA ID DARI URL*/}
            {/* https://example.com/?order_id=QACHLESS-202508012218&status_code=200&transaction_status=settlement */}
            {/* https://example.com/payment/success/?order_id=QACHLESS-202508012218&status_code=200&transaction_status=settlement */}
            
            <div className="flex items-center gap-2">
                <CheckCircle color="#00ff00" size={30} />
                <p className='text-2xl font-bold'> Payment successful </p>
            </div>
            <Link href="/admin/order">
                <Button className='cursor-pointer' variant={'outline'}> Back to order </Button>
            </Link>
        </div>
    )
}