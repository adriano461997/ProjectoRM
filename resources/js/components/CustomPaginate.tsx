import * as React from 'react';
import { Link } from "@inertiajs/react";
import { PaginationData } from "@/types";

interface Props {
    items: PaginationData<any>;
    eachside?: number;
}

export const CustomPaginate = ({ items, eachside = 2 }: Props) => {
    if (items.last_page === 1) {
        return null;
    }

    const startPage = Math.max(1, items.current_page - eachside);
    const endPage = Math.min(items.last_page, items.current_page + eachside);

    const pageNumbers = [];
    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push('...');
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (endPage < items.last_page) {
        if (endPage < items.last_page - 1) {
            pageNumbers.push('...');
        }
        pageNumbers.push(items.last_page);
    }

    return (
        <div>
            <nav className={"block"}>
                <ul className={"flex pl-0 list-none rounded my-2"}>
                    <li>
                        <Link href={items.prev_page_url || "#"}
                              className={"relative block py-1 px-2 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200"}>Anterior</Link>
                    </li>
                    {
                        pageNumbers.map((item, index) => (
                            <li key={index}>
                                {item === '...' ? (
                                    <span className="relative block py-1 px-2 leading-tight border border-gray-300 mr-1 bg-white text-gray-800">...</span>
                                ) : (
                                    <Link href={items.path + "?p=" + item}
                                          className={`relative block py-1 px-2 leading-tight border border-gray-300 mr-1 hover:bg-gray-200 ${items.current_page === item ? 'bg-primary text-white' : 'bg-white text-gray-800'}`}>{item}</Link>
                                )}
                            </li>
                        ))
                    }
                    <li>
                        <Link href={items.next_page_url || "#"}
                              className={"relative block py-1 px-2 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200"}>Próximo</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
