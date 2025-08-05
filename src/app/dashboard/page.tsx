import { Metadata } from 'next'
import React from 'react'
import DashboardContent from './_components/dashboard-content'


export const metadata: Metadata = {
    title: 'Qashless | Dashboard'
}

export default function PageDashboard(){
    return <DashboardContent />
}