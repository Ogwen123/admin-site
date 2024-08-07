import React from 'react'

import { UserGroupIcon, CloudIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/20/solid'
import { AppOutletContext, SidebarTab, SubSelected } from '../global/types'
import { Link } from 'react-router-dom'
import { url } from '../utils/url'
import { useOutletContext } from 'react-router-dom'
import LoadingWheel from './LoadingWheel'

const SideBar = () => {

    const { user, updateSidebar, setUpdateSidebar } = useOutletContext<AppOutletContext>()

    const [selected, setSelected] = React.useState<number>()
    const [subSelected, setSubSelected] = React.useState<SubSelected>()
    const [loggingOut, setLoggingOut] = React.useState<boolean>(false)

    React.useEffect(() => {
        for (let i of sidebarTabs) {
            if (location.href.endsWith(i.url)) {
                setSelected(i.id)
                setSubSelected(undefined)
            } else if (location.href.includes(i.url)) {
                if (!i.subSites) return
                for (let j of i.subSites) {
                    if (location.href.endsWith(j.url)) {
                        setSubSelected({
                            parentId: i.id,
                            name: j.name
                        })
                        setSelected(i.id)
                    }
                }
            }
        }
    }, [updateSidebar])

    const sidebarTabs: SidebarTab[] = [
        {
            id: 0,
            name: "Users",
            url: "/users",
            icon: <UserGroupIcon className='h-7 w-7' />,

        },
        {
            id: 1,
            name: "Services",
            url: "/services",
            icon: <CloudIcon className='h-7 w-7' />,
            subSites: [
                {
                    id: 1,
                    name: "Add Service",
                    url: "/services/add"
                }
            ]
        },
        {
            id: 2,
            name: "Statistics",
            url: "/statistics",
            icon: <ChartPieIcon className='h-7 w-7' />
        },
        {
            id: 3,
            name: "Analytics",
            url: "/analytics",
            icon: <ChartBarIcon className='h-7 w-7' />
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
        <div className='page-parent border-r-solid border-r-hr border-r-[2px] min-w-[150px] w-[15vw] bg-bgdark flex flex-col p-[10px]'>
            {
                sidebarTabs.map((tab, index) => {

                    let colour = " bg-bgdark hover:bg-hrdark"

                    if (tab.id === selected) {
                        colour = " bg-main"
                    }

                    return (
                        subSelected && subSelected.parentId === tab.id ?
                            <div key={index}>
                                <Link
                                    className='flex flex-row mb-[10px] p-[10px] rounded-md bg-main bg-opacity-60'
                                    to={tab.url}
                                    onClick={() => {
                                        setSelected(tab.id)
                                        setUpdateSidebar(!updateSidebar)
                                    }}
                                >
                                    {tab.icon}
                                    <div className='w-[100px] ml-auto flex justify-end items-center'>
                                        {tab.name}
                                    </div>
                                </Link>
                                <div className='flex flex-row'>
                                    <svg className='fill-hr w-[80px] h-[40px] rotate-[135deg]' xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 45 20">
                                        <polyline className="fill-none stroke-hr stroke-[2px]" points="12.25,5 23.25,16 12.25,27 " />
                                    </svg>
                                    <div className='text-main'>
                                        {subSelected.name}
                                    </div>
                                </div>
                            </div>
                            :
                            <Link
                                className={'flex flex-row mb-[10px] p-[10px] rounded-md' + colour}
                                to={tab.url}
                                onClick={() => {
                                    setSelected(tab.id)
                                    setUpdateSidebar(!updateSidebar)
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
                className='rounded-md w-[calc(100%-20px])] mt-auto mb-[10px] bg-error hover:bg-errordark p-[10px] h-[48px] '
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