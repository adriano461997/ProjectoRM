import * as React from "react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import {Link, usePage} from "@inertiajs/react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {NavUser} from "@/components/nav-user";
import {NavAdmin} from "@/Layouts/nav-admin";
import {NavFiliar} from "@/Layouts/nav-filiar";


export interface BreadCumbItem {
    label: string;
    url: string|null;
}

export default function AuthenticatedLayout({children, breadcrumbs}: {
    children: React.ReactNode,
    breadcrumbs?: BreadCumbItem[],
}) {

    const {props} = usePage();


    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem className={"text-center"}>
                                <Link className={"gap-3"} href={props.f ? route("filiar.index", props.f.slug):route("dashboard")}>
                                    <img alt={"logo"} src={"/imagens/logo.png"} className={"w-[70px] mx-auto"} />
                                </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>

                    {
                        !props.f && (
                            <NavAdmin />
                        )
                    }

                    {
                        props.f as any && (
                            <NavFiliar />
                        )
                    }

                </SidebarContent>

                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>
            <SidebarInset className={"overflow-x-auto"}>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                     <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem className={item.url ? "hidden md:block" : ""}>
                                        {breadcrumbs.length === index + 1 ? (
                                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.url ?? "#"}>
                                                    {item.label}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {breadcrumbs.length !== index + 1 && (
                                        <BreadcrumbSeparator className="hidden md:block" />
                                    )}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>

                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">

                    {children}

                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
