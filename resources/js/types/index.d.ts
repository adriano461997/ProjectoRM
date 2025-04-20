export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};

export type LinksPaginationData = {
    url: string | null
    label: string
    active: boolean
}

export interface PaginationData<T> {
    data: T[];
    current_page: number;
    first_page_url: number;
    from: number,
    last_page_url: string,
    last_page: number,
    links: LinksPaginationData[],
    next_page_url: string | null
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number,
    total: number,
}
