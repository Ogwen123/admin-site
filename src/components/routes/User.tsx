import React from 'react'
import { _Alert, AppOutletContext, ServicesPermissions, UserData } from '../../global/types'
import { useOutletContext } from 'react-router-dom'
import Alert, { alertReset } from '../Alert'
import { url } from '../../utils/url'
import LoadingWheel from '../LoadingWheel'

const User = () => {

    const { user } = useOutletContext<AppOutletContext>()

    const [userId, setUserId] = React.useState<string>()
    const [usersData, setUsersData] = React.useState<UserData>()

    const [permissions, setPermissions] = React.useState<Permissions>()
    const [servicesPermissions, setServicesPermissions] = React.useState<ServicesPermissions>()

    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    React.useEffect(() => {

        const splitLoc = location.pathname.split("/")

        setUserId(splitLoc[splitLoc.length - 1])

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

        fetch(url("auth") + "permissions/services", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + user.token
            }
        }).then((res) => {
            if (!res.ok) {
                setAlert(["Could not fetch services permissions. Please reload the page.", "ERROR", true])
                setTimeout(() => { setAlert(alertReset) }, 5000)
            } else {
                res.json().then((data) => {
                    setServicesPermissions(data.data)
                })
            }
        })
    }, [])

    React.useEffect(() => {
        if (!userId) return
        fetch(url("admin") + "user", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: userId
            })
        }).then((res) => {
            if (!res.ok) {
                setAlert(["Could not fetch user data. Please reload the page.", "ERROR", true])
                setTimeout(() => { setAlert(alertReset) }, 5000)
            } else {
                res.json().then((data) => {
                    setUsersData(data.data)
                })
            }
        })
    }, [userId])

    return (
        <div>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
            {
                usersData && permissions && servicesPermissions ?
                    <div>loaded everything probably successfully</div>
                    :
                    <LoadingWheel />
            }
        </div>
    )
}

export default User