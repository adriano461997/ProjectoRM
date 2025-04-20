// @flow
import * as React from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {Link, usePage} from "@inertiajs/react";
import {ArrowRight, Calculator, ChartBar, ChevronRight, Home, LayoutPanelTop, ListIcon, Users} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

type Props = {

};


export const NavAdmin = () => {
    const {props} = usePage();
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Home</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={route().current("dashboard")}>
                            <Link href={"/"}>
                                <Home /> Dashboard
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={route().current("empresas.index")}>
                            <Link href={route("empresas.index")}>
                                <LayoutPanelTop /> Empresas
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={route().current("categorias.index")}>
                            <Link href={route("categorias.index")}>
                                <ListIcon /> Categorias
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={route().current("usuarios.index")}>
                            <Link href={route("usuarios.index")}>
                                <Users /> Usuários
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenu>
                        <Collapsible
                            asChild
                            defaultOpen={false}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                        <Calculator />
                                        <span>Contabilidade</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>

                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={"/contabilidade/movimentos"}>
                                                    <span>Movimentos</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>

                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={"/contabilidade/exercicios"}>
                                                    <span>Exercicios</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>

                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={"/contabilidade/contas"}>
                                                    <span>Contas</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>

                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>

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
                <SidebarGroupLabel>Resumo</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={route().current("recuso.index")}>
                            <Link href={route("resumo.index")}>
                                <ChartBar /> Resumo
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
                            <SidebarMenuButton title={item.nome} className={"truncate"} asChild isActive={route().current("relatorio.index", [item.slug])}>
                                <Link href={route("relatorio.index", [item.slug])}>
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
