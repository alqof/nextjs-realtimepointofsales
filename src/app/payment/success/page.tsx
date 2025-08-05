import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import PageContentSuccess from './_components/pageContentSuccess'

export const metadata: Metadata = {
    title: 'QachleQashlessss | Payment Success'
}

export default function PagePaymentSuccess(){
    return <PageContentSuccess />
}