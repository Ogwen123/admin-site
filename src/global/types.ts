import React from "react"

export type User = {
    token: string
}

export type AppOutletContext = {
    user: User,
    updateSidebar: boolean,
    setUpdateSidebar: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export type _Alert = [string | [string, string], "SUCCESS" | "ERROR", boolean]

export type SubSite = {
    id: number,
    name: string,
    url: string,
}

export type SidebarTab = {
    id: number,
    name: string,
    url: string,
    icon: React.ReactElement,
    subSites?: SubSite[]
}

export type SubSelected = {
    parentId: number,
    name: string
}

export type ShallowServiceData = {
    id: string,
    name: string,
    alias: string,
    type: "BACKEND" | "FRONTEND",
    enabled: boolean,
    toggleable: boolean
}

export type ServicesFilters = {
    search: string,
    filter: "BACKEND" | "FRONTEND" | "NONE"
}