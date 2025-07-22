'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation"
import { Fragment } from "react";

export default function DashboardBreadcrumb(){
    const pathname = usePathname();
    const pathsplit = pathname.split('/').slice(1);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathsplit.map((value, index) => (
                    <Fragment key={index}>
                        <BreadcrumbItem className="capitalize">
                            {index < (pathsplit.length - 1) ? (
                                <>
                                    <BreadcrumbLink href={`/${pathsplit.slice(0, index + 1).join('/')}`}>
                                        {value}
                                    </BreadcrumbLink>
                                    <ChevronRight size={18}/>
                                </>
                            ):(
                                <BreadcrumbPage> {value} </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}