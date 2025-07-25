import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function TableUserPagination() {
    return(
        <Pagination>
            <PaginationContent className="cursor-pointer">
                <PaginationItem>
                    <PaginationPrevious></PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                    <PaginationLink>2</PaginationLink>
                    <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext></PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}