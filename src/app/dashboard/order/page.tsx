import { Metadata } from 'next'
import PageOrderManagement from './_compnents/001-pageOrderManagement'


export const metadata: Metadata = {
    title: 'Qashless | Order'
}

declare global {
    interface Window {
        snap: any; // atau bisa lebih spesifik sesuai dokumentasi Midtrans Snap
    }
}

export default function PageOrder() {
    return <PageOrderManagement />
}