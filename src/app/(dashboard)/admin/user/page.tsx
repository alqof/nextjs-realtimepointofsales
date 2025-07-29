import { Metadata } from "next";
import PageUserManagement from "./_components/001-pageUserManagement";

export const metadata: Metadata = {
    title: 'QopzKuy | User Management'
}

export default function PageUser(){
    return <PageUserManagement />
}