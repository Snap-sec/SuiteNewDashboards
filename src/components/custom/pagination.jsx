import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';


export default function PaginationView({ currentPage = 1, totalPages, onPageChange, className }) {

    if (totalPages == 0 || !totalPages) return null;

    let startsFrom = Math.max(1, currentPage - 1);
    let endsAt = Math.min(totalPages, currentPage + 1);

    endsAt = currentPage == startsFrom && currentPage + 2 <= totalPages ? currentPage + 2 : endsAt;

    const handlePrev = () => {
        if (currentPage == 1) return;

        onPageChange(currentPage - 1);
    }

    const handleNext = () => {
        if (currentPage == totalPages) return;

        onPageChange(currentPage + 1);
    }

    const handleJump = (page) => {
        onPageChange(page);
    }


    const visiblePages = [];

    for (let i = startsFrom; i <= endsAt; i++) {
        visiblePages.push(i);
    }

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <Button disabled={currentPage == 1} variant="ghost" onClick={handlePrev}>
                        <ChevronLeft className="rtl:rotate-180" /> Previous
                    </Button>
                </PaginationItem>
                {
                    !visiblePages.includes(1) &&
                    <PaginationItem>
                        <Button variant="ghost" mode="icon" onClick={() => handleJump(1)}>
                            <PaginationEllipsis />
                        </Button>
                    </PaginationItem>
                }

                {
                    visiblePages.map((page, index) => {
                        return (
                            <PaginationItem>
                                <Button variant={page == currentPage ? "outline" : "ghost"} mode="icon" onClick={() => handleJump(page)}>
                                    {page}
                                </Button>
                            </PaginationItem>
                        )
                    })
                }

                {
                    !visiblePages.includes(totalPages) &&
                    <PaginationItem>
                        <Button variant="ghost" mode="icon" onClick={() => handleJump(totalPages)}>
                            <PaginationEllipsis />
                        </Button>
                    </PaginationItem>
                }
                <PaginationItem>
                    <Button disabled={currentPage == totalPages} variant="ghost" onClick={handleNext}>
                        Next <ChevronRight className="rtl:rotate-180" />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
