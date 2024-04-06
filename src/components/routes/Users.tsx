//import React from 'react'

import React from "react"
import { useUser } from "../../App"
import { Permissions, UserData, _Alert } from "../../global/types"
import Alert, { alertReset } from "../Alert"
import { url } from "../../utils/url"
import UserChip from "../users/UserChip"
import LoadingWheel from "../LoadingWheel"

const Users = () => {
    const { user } = useUser()

    const [users, setUsers] = React.useState<UserData[]>()
    const [shownUsers, setShownUsers] = React.useState<UserData[]>()
    const [query, setQuery] = React.useState<string>("")
    const [permissions, setPermissions] = React.useState<Permissions>()

    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    React.useEffect(() => {
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


        if (localStorage.getItem("users") !== null) { // cache the services in localstorage and fetch them if cache is more than 10 seconds old
            const userData = JSON.parse(localStorage.getItem("users")!)
            if (userData.timeGot < Date.now() - 10 * 1000) {
                fetchUsers()
                return
            } else {
                setUsers(userData.services)
                setShownUsers(userData.services)
            }
        } else {
            fetchUsers()
            return
        }
    }, [])

    React.useEffect(() => {
        if (query === "") {
            setShownUsers(users)
        }
    }, [query])

    const searchUsers = () => {

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

        localStorage.setItem("users", JSON.stringify({
            timeGot: Date.now(),
            services: userData
        }))

        setUsers(userData)
        setShownUsers(userData)
    }

    return (
        <div>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
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
                    Search
                </button>
                <button
                    className='button w-[15%] bg-warning hover:bg-warningdark m-0'
                    onClick={() => {
                        setQuery("")
                    }}
                >
                    Clear Filters
                </button>
            </div>
            {
                shownUsers ?
                    shownUsers?.map((user, index) => {
                        return (
                            <UserChip userData={user} permissions={permissions} key={index} />
                        )
                    })
                    :
                    <div className='my-[10px]'>
                        <LoadingWheel />
                    </div>
            }
        </div>
    )
}

export default Users