import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import { AppOutletContext, Layout, User } from './global/types'

const App = () => {

    const [user, setUser] = React.useState<User>()
    const [updateSidebar, setUpdateSidebar] = React.useState<boolean>()
    const [layout, setLayout] = React.useState<Layout>({ layout: "DESKTOP" })

    window.addEventListener("resize", () => {
        console.log("resize: ", window.innerWidth)
        if (window.innerWidth < 950) {
            setLayout({ layout: "MOBILE" })
        } else {
            setLayout({ layout: "DESKTOP" })
        }
    })

    React.useEffect(() => {
        console.log(layout)
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
            <Outlet context={{ user, updateSidebar, setUpdateSidebar, layout }} />
        </div>
    )
}

export default App
