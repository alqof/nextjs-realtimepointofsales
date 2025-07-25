import { ReactNode } from "react";
import { Card } from "../../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function TableUser(
    { isLoading, header, data, totalPages, currentPage, currentLimit, onChangePage, onChangeLimit }: 
    {
        isLoading: boolean; 
        header: string[]; 
        data: (string | ReactNode)[][];
        totalPages: number;
        currentPage: number;
        currentLimit: number;
        onChangePage: (page: number) => void;
        onChangeLimit:(limit: number) => void;
    }
){
    return(
        <div className="w-full flex flex-col gap-4">
            <Card className="p-1">
                <Table className="w-full rounded-lg overflow-hidden">
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            {header.map((column) => (
                                <TableHead key={`th-${column}`} className="px-6 py-3"> {column} </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data?.map((row, rowIndex) => (
                            <TableRow key={`tr-${rowIndex}`}>
                                {row?.map((column, columnIndex) => (
                                    <TableCell key={`th-${columnIndex}`} className="px-6 py-3"> {column} </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {data?.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={header.length} className="h-24 text-center"> No Result Data </TableCell>
                            </TableRow>
                        )}
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={header.length} className="h-24 text-center"> Loading... </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <div className="">
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent className="cursor-pointer">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => {
                                        if (currentPage > 1) {
                                            onChangePage(currentPage - 1);
                                        }
                                    }}
                                    aria-disabled={currentPage === 1}
                                    className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => {
                                const page = i + 1;
                                if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink 
                                                isActive={page===currentPage}
                                                onClick={()=>{
                                                    if(page!==currentPage){
                                                        onChangePage(page)
                                                    }
                                                }}
                                            > 
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                if((page===currentPage-2 && page>1) || (page===currentPage+2 && page<totalPages)){
                                    return(
                                        <PaginationItem key={page}>
                                            <PaginationEllipsis/>
                                        </PaginationItem>
                                    )
                                }
                            })}

                            <PaginationItem>
                                <PaginationNext 
                                    onClick={()=>{
                                        if(currentPage<totalPages){
                                            onChangePage(currentPage+1)
                                        }}
                                    }
                                    aria-disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    )
}