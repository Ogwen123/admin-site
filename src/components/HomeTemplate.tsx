import React from 'react'
import { useUser } from '../App'
import SideBar from './SideBar'
import { Outlet } from 'react-router-dom'

const HomeTemplate = () => {
    const { user } = useUser()
    const [page, setPage] = React.useState<string>("")

    React.useEffect(() => {
        const split = location.pathname.split("/")
        setPage(split[split.length - 1])
    }, [])

    const hasScroll = ["analytics"]

    return (
        <div className='flex flex-row page-parent w-full'>
            {user ?
                <div className='flex flex-row page-parent w-full'>
                    <SideBar />
                    <div
                        className='p-[5px] w-[85vw]'
                        style={{ paddingRight: (hasScroll.includes(page) ? "0px" : "5px") }}
                    >
                        <Outlet context={{ user }} />
                    </div>
                </div>
                :
                <div></div>
            }
        </div>
    )
}

export default HomeTemplate