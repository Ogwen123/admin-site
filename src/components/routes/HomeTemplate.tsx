//import React from 'react'
import { useUser } from '../../App'
import SideBar from '../SideBar'
import { Outlet } from 'react-router-dom'

const HomeTemplate = () => {
    const { user } = useUser()

    return (
        <div className='flex flex-row page-parent w-full'>
            {user ?
                <div className='flex flex-row page-parent w-full'>
                    <SideBar />
                    <div className='p-[5px] w-[85vw]'>
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