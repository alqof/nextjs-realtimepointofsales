import { Metadata } from 'next'
import PageTableManagement from './_components/001-pageTableManagement'

export const metadata: Metadata = {
    title: 'QopzKuy | Table'
}


export default function PageTable() {
    return <PageTableManagement />
}