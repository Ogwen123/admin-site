import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import { AppOutletContext, User } from './global/types'

const App = () => {

    const [user, setUser] = React.useState<User>()
    const [updateSidebar, setUpdateSidebar] = React.useState<boolean>()

    React.useEffect(() => {
        const userData = localStorage.getItem("token")

        if (location.pathname.endsWith("/login")) {
            if (userData !== null) {
                location.href = "/"
            }
        } else {
            if (userData === null) {
                location.href = "/login"
            } else {
                setUser({ token: userData })
            }
        }
    }, [])



    return (
        <div className='min-h-[100vh] overflow-hidden'>
            <NavigationBar />
            <Outlet context={{ user, updateSidebar, setUpdateSidebar }} />
        </div>
    )
}

export default App

export const useUser = () => {
    return useOutletContext<AppOutletContext>()
}