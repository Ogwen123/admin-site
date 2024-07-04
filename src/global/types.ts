import React from "react"

export type User = {
    token: string
}

export type AppOutletContext = {
    user: User,
    layout: Layout,
    updateSidebar: boolean,
    setUpdateSidebar: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

export type _Alert = [string | [string, string], "SUCCESS" | "ERROR", boolean]

export type Layout = {
    layout: "DESKTOP" | "MOBILE"
}

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

export type LoginFailObject = {
    INVALID_BODY: number,
    INCORRECT_IDENTIFIER: number,
    INCORRECT_PASSWORD: number,
    INSUFFICIENT_PERMISSIONS: number,
    DISABLED_ACCOUNT: number,
    INSUFFICIENT_SERVICE_PERMISSIONS: number
}

export type _Analytics = {
    logins: {
        [date: string]: { total: number, success: number, fail: number }
    },
    tables: {
        [date: string]: number
    },
    loginFails: {
        [date: string]: LoginFailObject
    }
}

export type AnalyticSettings = {
    logins: {
        timeframe: "DAY" | "MONTH",
        type: "ALL" | "TOTAL" | "SUCCESS" | "FAIL"
    },
    tables: {
        timeframe: "DAY" | "MONTH",
        type: "TOTAL" | "CREATED"
    }
}

export type AnalyticsMetaData = {
    logins: {
        maxValue: number,
        successTotal: number,
        failTotal: number
    }
}