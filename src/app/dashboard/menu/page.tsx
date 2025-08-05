import { Metadata } from 'next'
import PageMenuManagement from './_components/001-pageMenuManagement'

export const metadata: Metadata = {
    title: 'Qashless | Menu'
}


export default function PageMenu() {
    return <PageMenuManagement />
}