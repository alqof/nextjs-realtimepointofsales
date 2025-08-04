'use server'
import { createClient } from "@/lib/supabase/server";
import { cartState, formState, orderFormState } from "../types";
import { createOrderSchema } from "../validations/validation-order";
import { redirect } from "next/navigation";
import { environments } from "@/lib/config/environments";
import midtransClient from "midtrans-client"


export async function actionCreateOrder(prevState:orderFormState, formData: FormData){
    const validationFields = createOrderSchema.safeParse({
        customer_name: formData.get('customer_name'),
        table_id: formData.get('table_id'),
        status: formData.get('status'),
    })

    if(!validationFields.success){
        const fieldErrors = Object.values(validationFields.error.flatten().fieldErrors).flat().filter(Boolean);
        return {
            status: 'error',
            errors: {
                ...validationFields.error.flatten().fieldErrors,
                _form: fieldErrors.length > 0 ? fieldErrors : ['Form input is invalid!'],
            },
        }
    }

    // insert to orders & update tables.status 
    const supabase = await createClient();

    const now = new Date();
    const date = now.toISOString().slice(0,10).replace(/-/g,''); // yyyymmdd
    const time = now.toTimeString().slice(0,5).replace(/:/g,''); // hhmm
    const generatedOrderId = `QACHLESS-${date}${time}`;

    const [orderResult, tableResult] = await Promise.all([
        supabase
            .from('orders')
            .insert({
                order_id: generatedOrderId,
                customer_name: validationFields.data.customer_name,
                table_id: validationFields.data.table_id,
                status: validationFields.data.status,
            })
        ,
        supabase.from('tables')
            .update({
                status: validationFields.data.status==='reserved' ? 'reserved' : 'unavailable',
            })
            .eq('id', validationFields.data.table_id)
        ,
    ]);

    if (orderResult.error || tableResult.error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [
                    ...(orderResult.error ? [orderResult.error.message] : []),
                    ...(tableResult.error ? [tableResult.error.message] : []),
                ],
            },
        };
    }
    
    return {
        status: 'success'
    }
}


export async function actionUpdateReservation(prevState:formState, formData: FormData){
    const supabase = await createClient();
    // Get current user && Ambil role user dari table profiles
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["Unauthorized access!"],
            },
        };
    }
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
    ;
    if (profileError || !profile) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["Profile not found!"],
            },
        };
    }
    if (profile.role==="kitchen") { // Hanya admin dan cashier yang bisa eksekusi
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["Kitchen is not allowed to process !"],
            },
        };
    }

    const [orderResult, tableResult] = await Promise.all([
        supabase
            .from('orders')
            .update({status: formData.get('status')})
            .eq('id', formData.get('id'))
        ,
        supabase
            .from('tables')
            .update({status: formData.get('status') === 'process' ? 'unavailable' : 'available'})
            .eq('id', formData.get('table_id'))
        ,
    ]);

    if (orderResult.error || tableResult.error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [
                    ...(orderResult.error ? [orderResult.error.message] : []),
                    ...(tableResult.error ? [tableResult.error.message] : []),
                ],
            },
        };
    }

    return {
        status: 'success'
    }
}


export async function actionUpdateStatusOrder(prevState: formState, formData: FormData) {
    const supabase = await createClient();
    // Get current user && Ambil role user dari table profiles
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["Unauthorized access!"],
            },
        };
    }
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
    ;
    if (profileError || !profile) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["Profile not found!"],
            },
        };
    }
    if (profile.role==="cashier") { // Hanya kitchen yang bisa eksekusi
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: ["Only the kitchen is allowed to process!"],
            },
        };
    }

    const { error } = await supabase
        .from('orders_menus')
        .update({status: formData.get('status')})
        .eq('id', formData.get('id'))
    ;

    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState,
                _form: [error.message],
            },
        };
    }

    return {
        status: 'success',
    };
}


export async function actionAddMenuOrder(prevState: orderFormState, data: { order_id: string; items: cartState[]}) {
    const supabase = await createClient();
    const payload = data.items.map(({ total, menu, ...item }) => item);
    const { error } = await supabase.from('orders_menus').insert(payload);
    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState,
                _form: [],
            },
        };
    }

    redirect(`/dashboard/order/${data.order_id}`);
}

export async function actionGeneratePayment(prevState: formState, formData: FormData) {
    const supabase = await createClient();
    const orderId = formData.get('order_id');
    const grossAmount = formData.get('gross_amount');
    const customerName = formData.get('customer_name');
    // const midtransClient = require('midtrans-client') //https://docs.midtrans.com/recipes/snap-how-to-create-snap-token

    const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: environments.MIDTRANS_SERVER_KEY!,
    });

    const parameters = {
        transaction_details: {
            order_id: `${orderId}`,
            gross_amount: parseFloat(grossAmount as string),
        },
        customer_details: {
            first_name: customerName,
        },
    };
    console.log(parameters)

    const result = await snap.createTransaction(parameters);
    if (result.error_messages) {
        return {
            status: 'error',
            errors: {
                ...prevState,
                _form: [result.error_messages],
            },
            data: {
                payment_token: '',
            },
        };
    }

    await supabase
        .from('orders')
        .update({ payment_token: result.token })
        .eq('order_id', orderId)
    ;

    return {
        status: 'success',
        data: {
            // payment_token: '',
            payment_token: `${result.token}`,
        },
    };
}