import React from 'react'

import { UserGroupIcon, CloudIcon } from '@heroicons/react/20/solid'
import { SidebarTab } from '../global/types'
import { Link } from 'react-router-dom'
import { url } from '../utils/url'
import { useUser } from '../App'
import LoadingWheel from './LoadingWheel'

const SideBar = () => {

    const { user } = useUser()

    const [selected, setSelected] = React.useState<number>()
    const [loggingOut, setLoggingOut] = React.useState<boolean>(false)

    React.useEffect(() => {
        for (let i of sidebarTabs) {
            if (location.href.includes(i.url)) {
                setSelected(i.id)
            }
        }
    }, [])

    const sidebarTabs: SidebarTab[] = [
        {
            id: 1,
            name: "Users",
            url: "/users",
            icon: <UserGroupIcon className='h-7 w-7' />
        },
        {
            id: 2,
            name: "Services",
            url: "/services",
            icon: <CloudIcon className='h-7 w-7' />
        }
    ]

    const logout = () => {
        setLoggingOut(true)
        fetch(url("auth") + "logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: user.token
            })
        }).then((res) => {
            if (res.ok) {
                localStorage.removeItem("token")
                location.href = "/login"
                setLoggingOut(false)
            }
        }).catch(() => {
            setLoggingOut(false)
        })
    }

    return (
        <div className='page-parent border-r-solid border-r-hr border-r-[2px] min-w-[150px] w-[15vw] bg-bgdark flex flex-col'>
            {
                sidebarTabs.map((tab, index) => {

                    let colour = "bg-bgdark"

                    if (tab.id === selected) {
                        colour = " bg-main"
                    }

                    return (
                        <Link
                            className={'flex flex-row m-[10px] p-[10px] rounded-md' + colour}
                            to={tab.url}
                            onClick={() => {
                                setSelected(tab.id)
                            }}
                            key={index}
                        >
                            {tab.icon}
                            <div className='w-[100px] ml-auto flex justify-end items-center'>
                                {tab.name}
                            </div>
                        </Link>
                    )
                })
            }
            <button
                className='mt-auto rounded-md w-[calc(100%-20px])] m-[10px] bg-error hover:bg-errordark p-[10px] h-[48px]'
                onClick={() => {
                    logout()
                }}
            >
                {
                    loggingOut ?
                        <LoadingWheel size={28} />
                        :
                        <div>
                            Logout
                        </div>
                }
            </button>
        </div>
    )
}

export default SideBar