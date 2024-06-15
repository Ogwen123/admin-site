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

export type ServiceData = {
    id: string,
    name: string,
    alias: string,
    type: "BACKEND" | "FRONTEND",
    enabled: boolean,
    toggleable: boolean
}

export type UserData = {
    id: string,
    username: string,
    name: string,
    email: string,
    perm_flag: number
}

export type ServicesFilters = {
    search: string,
    filter: "BACKEND" | "FRONTEND" | "NONE"
}

export type Permissions = { [id: number]: string }

export type Stats = {
    users: number,
    admins: number,
    tables: number,
    services: number
}

export type _Analytics = {
    logins: {
        [date: string]: { total: number, success: number, fail: number }
    }
}

export type AnalyticSettings = {
    timeframe: "DAY" | "MONTH",
    type: "ALL" | "TOTAL" | "SUCCESS" | "FAIL"
}

export type RechartData = {
    name: string,
    fails: number,
    sucesses: number,
    total: number
}