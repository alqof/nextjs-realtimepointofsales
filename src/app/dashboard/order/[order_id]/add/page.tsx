import { Metadata } from 'next'
import PageOrderAddMenu from './_components/003-pageOrderAddMenu';

export const metadata: Metadata = {
    title: 'Qashless | Add order menu'
}

export default async function PageOrderIdAdd({params}: {params: Promise<{order_id: string}>}) {
    const {order_id} = await params;

    return (
        <PageOrderAddMenu order_id={order_id} />
    )
}