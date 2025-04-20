// @flow
import * as React from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {Link, usePage} from "@inertiajs/react";
import {ArrowRight, Home, LayoutPanelTop, ListIcon, Users} from "lucide-react";

type Props = {

};

export const NavFiliar = () => {

    const {props: props} = usePage();

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Home</SidebarGroupLabel>

                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={route().current("filiar.index", props.f.slug)}>
                            <Link href={route("filiar.index", props.f.slug)}>
                                <Home /> Dashboard
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={route("escolher")}>
                            <ArrowRight /> Escolher
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>

            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Relatórios</SidebarGroupLabel>

                <SidebarMenu>
                    {
                        props.categorias.map((item)=>(
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton title={item.nome} className={"truncate"} asChild isActive={route().current("filiar.categoria.index", [props.f.slug, item.slug])}>
                                    <Link href={route("filiar.categoria.index", [props.f.slug, item.slug])}>
                                        <ListIcon /> {item.nome}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    }
                </SidebarMenu>

            </SidebarGroup>
        </>
    );
};
