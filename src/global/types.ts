import React from "react"

export type User = {
    token: string
}

export type AppOutletContext = {
    user: User
}

export type _Alert = [string | [string, string], "SUCCESS" | "ERROR", boolean]

export type SidebarTab = {
    id: number,
    name: string,
    url: string,
    icon: React.ReactElement
}

export type ShallowServiceData = {
    id: string,
    name: string,
    alias: string,
    type: "BACKEND" | "FRONTEND",
    enabled: boolean,
    togglable: boolean
}

export type ServicesFilters = {
    search: string,
    filter: "BACKEND" | "FRONTEND" | "NONE"
}