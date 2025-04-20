import * as React from "react";
import { Link } from "@inertiajs/react";
import { PaginationData } from "@/types";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomShadCNPaginationProps<T> {
    data: PaginationData<T>;
    only?: string[];
    hidePrevButton?: boolean;
    hideNextButton?: boolean;
}

export default function CustomShadCNPagination<T>({
    data,
    only = [],
    hidePrevButton = false,
    hideNextButton = false,
}: CustomShadCNPaginationProps<T>) {
    if (!data || !data.links || data.links.length <= 3) {
        return null;
    }

    const pageLinks = data.links.slice(1, -1);

    return (
        <Pagination>
            <PaginationContent>
                {!hidePrevButton && data.prev_page_url && (
                    <PaginationItem>
                        <PaginationPrevious>
                            <Link
                                only={only}
                                href={data.prev_page_url}
                            >
                                {data.prev_page_url && (
                                    <span>Anterior</span>
                                )}
                            </Link>
                        </PaginationPrevious>
                    </PaginationItem>
                )}

                {pageLinks.map((link, index) => {

                    if (link.label === "..." || link.url === null) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={link.active}
                            >
                                <Link
                                    only={only}
                                    href={link.url}
                                >
                                    {link.label}
                                </Link>
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {!hideNextButton && data.next_page_url && (
                    <PaginationItem>
                        <PaginationNext>
                            <Link
                                only={only}
                                href={data.next_page_url}
                            >
                                {data.next_page_url && (
                                    <span>Próximo</span>
                                )}
                            </Link>

                        </PaginationNext>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
