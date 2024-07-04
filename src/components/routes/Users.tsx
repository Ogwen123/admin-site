//import React from 'react'

import React from "react"
import { useOutletContext } from "react-router-dom"
import { AppOutletContext, Permissions, UserData, _Alert } from "../../global/types"
import Alert, { alertReset } from "../Alert"
import { url } from "../../utils/url"
import UserChip from "../users/UserChip"
import LoadingWheel from "../LoadingWheel"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"

const Users = () => {
    const { user, layout } = useOutletContext<AppOutletContext>()

    const [users, setUsers] = React.useState<UserData[]>()
    const [query, setQuery] = React.useState<string>("")
    const [permissions, setPermissions] = React.useState<Permissions>()

    const [displayType, setDisplayType] = React.useState<"ADMIN" | "SEARCH">("ADMIN")
    const [searchLoading, setSearchLoading] = React.useState<boolean>(false)

    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    React.useEffect(() => {
        console.log(layout)
        fetch(url("auth") + "permissions", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + user.token
            }
        }).then((res) => {
            if (!res.ok) {
                setAlert(["Could not fetch permissions. Please reload the page.", "ERROR", true])
                setTimeout(() => { setAlert(alertReset) }, 5000)
            } else {
                res.json().then((data) => {
                    setPermissions(data.data)
                })
            }
        })
        fetchUsers()
    }, [])

    const searchUsers = async (queryOverride?: string) => {
        if (query === "" || queryOverride === "") setDisplayType("ADMIN")
        else setDisplayType("SEARCH")

        setSearchLoading(true)
        let res;

        try {
            res = await fetch(url("admin") + "users/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.token
                },
                body: JSON.stringify({
                    query: (queryOverride !== undefined ? queryOverride : query)
                })
            })
        } catch (e) {
            setAlert(["Error when searching users.", "ERROR", true])
            setSearchLoading(false)
            setTimeout(() => {
                setAlert(alertReset)
            }, 5000)
            return
        }

        if (!res.ok) {
            setAlert(["Error when searching users.", "ERROR", true])
            setSearchLoading(false)
            setTimeout(() => {
                setAlert(alertReset)
            }, 5000)
            return
        }

        const data = await res.json()

        const userData = data.data as UserData[]

        setPermissions((prevPerms) => ({ ...prevPerms }))

        setUsers(userData)
        setSearchLoading(false)
    }

    const fetchUsers = async () => {
        const res = await fetch(url("admin") + "users", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + user.token
            }
        })

        if (!res.ok) {
            setAlert(["Error when fetching users.", "ERROR", true])
            setTimeout(() => {
                setAlert(alertReset)
            }, 5000)
            return
        }

        const data = await res.json()

        const userData = data.data as UserData[]

        setUsers(userData)
    }

    return (
        <div className='overflow-auto h-[calc(100vh-90px)]'>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
            layout: {layout.layout}
            <div className='flex flex-row w-full h-[55px] mt-[10px]'>
                <input
                    value={query}
                    className='form-input w-[70%] m-0'
                    placeholder='Search'
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                ></input>
                <button
                    className='button w-[15%] m-0 mx-[10px]'
                    onClick={() => {
                        searchUsers()
                    }}
                >
                    {
                        searchLoading ?
                            <LoadingWheel size={24} />
                            :
                            <div className="fc">
                                {
                                    layout.layout === "DESKTOP" ?
                                        <div>Search</div>
                                        :
                                        <MagnifyingGlassIcon className="w-7 h-7" />
                                }
                            </div>
                    }
                </button>
                <button
                    className='button w-[15%] bg-warning hover:bg-warningdark m-0'
                    onClick={() => {
                        searchUsers("")
                        setQuery("")
                    }}
                >
                    Clear Filters
                </button>
            </div>
            <div className="mt-[10px] text-2xl">{displayType === "ADMIN" ? "Admins" : "Search Results"}</div>
            <div className="flex flex-row flex-wrap">

                {
                    users && permissions ?
                        users?.map((user, index) => {
                            return (
                                <div
                                    key={index}
                                    className="h-[250px]"
                                    style={{
                                        width: "calc((100% / 3) - " + (index % 3 === 0 ? "5px)" : index % 3 === 2 ? "5px)" : "10px)"),
                                        minWidth: "250px",
                                        marginLeft: (index % 3 === 0 ? "0px" : index % 3 === 2 ? "5px" : "5px"),
                                        marginRight: (index % 3 === 0 ? "5px" : index % 3 === 2 ? "0px" : "5px")
                                    }}
                                >
                                    <UserChip
                                        userData={user}
                                        permissions={permissions}
                                        setUsers={setUsers}
                                        setAlert={setAlert}
                                    />
                                </div>
                            )
                        })
                        :
                        <div className='my-[10px] fc w-full'>
                            <LoadingWheel />
                        </div>
                }
            </div>
        </div>
    )
}

export default Users