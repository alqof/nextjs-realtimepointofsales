'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { environments } from "@/config/environments";
import { usePricing } from "@/hooks/use-pricing";
import { actionGeneratePayment } from "@/lib/actions/action-order";
import { INITIAL_STATE_GENERATE_PAYMENT } from "@/lib/constants/order-constant";
import { convertIDR } from "@/lib/utils";
import { menuSchemaValidation } from "@/lib/validations/validation-menu";
import { Loader2 } from "lucide-react";
import Script from "next/script";
import { startTransition, useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";


export default function SummaryOrderDetail(
    {
        order_id,
        orders,
        ordersMenus,
    }: {
        order_id: string;
        orders: {
            customer_name: string;
            tables: { name: string }[];
            status: string;
        } | null | undefined;
        ordersMenus: { 
            menus: menuSchemaValidation; 
            quantity: number; 
            status: string ;
        }[] | null | undefined;
    }
) {
    const { grandTotal, totalPrice, tax, service } = usePricing(ordersMenus);
    console.log(ordersMenus)

    const isAllServed = useMemo(() => {
        return ordersMenus?.every((item) => item.status==='served');
    }, [ordersMenus]);

    const [ generatePaymentState, generatePaymentAction, isPendingGeneratePayment] = useActionState(actionGeneratePayment, INITIAL_STATE_GENERATE_PAYMENT);
    const handleGeneratePayment = () => {
        const formData = new FormData();
        formData.append('order_id', order_id || '');
        formData.append('gross_amount', grandTotal.toString());
        formData.append('customer_name', orders?.customer_name || '');
        
        startTransition(() => {
            generatePaymentAction(formData);
        });
    };

    useEffect(() => {
        // console.log(generatePaymentState)
        if (generatePaymentState?.status==='error') {
            toast(
                <span style={{ display:'flex', alignItems:'center', gap:2, color:'#ff0000' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" width={18} height={18} style={{ marginRight: 4 }}>
                        <path fill="currentColor" fillRule="evenodd" d="M13.4 7A6.4 6.4 0 1 1 .6 7a6.4 6.4 0 0 1 12.8 0Zm-5.6 3.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM7 3a.8.8 0 0 0-.8.8V7a.8.8 0 0 0 1.6 0V3.8A.8.8 0 0 0 7 3Z" clipRule="evenodd"></path>
                    </svg>
                    Generate Payment Failed!
                </span>,
                { description: generatePaymentState.errors?._form?.[0] }
            )
        }
        if (generatePaymentState?.status==='success') {
            if (typeof window !== 'undefined' && window.snap && typeof window.snap.pay === 'function') {
                window.snap.pay(generatePaymentState.data.payment_token);
            } else {
                toast("Midtrans Snap belum siap! Silakan refresh halaman.");
            }
        }
    }, [generatePaymentState]);

    const [isSnapReady, setSnapReady] = useState(false);

    return (
        <Card className="w-full shadow-sm">
            <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold"> Customer Information </h3>

                {orders && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label> Name </Label>
                            <Input value={orders?.customer_name} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label> Table </Label>
                            <Input value={(orders?.tables as unknown as { name: string })?.name} disabled />
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <h3 className="text-lg underline font-semibold">Order Summary</h3>

                    <div className="flex justify-between items-center">
                        <p className="text-sm">Subtotal</p>
                        <p className="text-sm">{convertIDR(totalPrice)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm">Tax (12%)</p>
                        <p className="text-sm">{convertIDR(tax)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm">Service (5%)</p>
                        <p className="text-sm">{convertIDR(service)}</p>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">Total</p>
                        <p className="text-lg font-semibold">{convertIDR(grandTotal)}</p>
                    </div>

                    {ordersMenus?.length!==0 &&
                        orders?.status==='process' && (
                            <Button className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white cursor-pointer" type="submit" onClick={handleGeneratePayment} disabled={!isAllServed || isPendingGeneratePayment}>
                                { isPendingGeneratePayment ? <Loader2 className="animate-spin" /> : 'Pay' }
                            </Button>
                        )
                    }
                </div>
            </CardContent>
        </Card>
    );
}
