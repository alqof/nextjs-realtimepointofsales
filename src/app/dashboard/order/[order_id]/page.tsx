import { Metadata } from 'next'
import PageOrderDetail from './_components/002-pageOrderDetail'
import Script from 'next/script';
import { environments } from '@/lib/config/environments';


export const metadata: Metadata = {
    title: 'Qashless | Order Detail'
}

declare global {
    interface Window {
        snap: any; //atau bisa lebih spesifik sesuai dokumentasi Midtrans Snap
    }
}

export default async function PageOrderId({params}: {params: Promise<{order_id: string}>}) {
    const {order_id} = await params;

    return (
        <>
            <Script src='https://app.sandbox.midtrans.com/snap/snap.js' data-client-key={environments.MIDTRANS_CLIENT_KEY} strategy="lazyOnload" unsafe-inline />
            <PageOrderDetail order_id={order_id} />
        </>
    )
}