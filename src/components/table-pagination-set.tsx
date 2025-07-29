import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function TablePaginationSet(
    { 
        totalPages, 
        currentPage, 
        onChangePage, 
        onChangeLimit 
    }: {
        isLoading: boolean; 
        header: string[]; 
        totalPages: number;
        currentPage: number;
        onChangePage: (page: number) => void;
        onChangeLimit:(limit: number) => void;
    }
) {
    return(
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
                            const page = i+1;
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
    )
}