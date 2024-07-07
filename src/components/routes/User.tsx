import React from 'react'
import { _Alert, AppOutletContext, UserData, Permissions } from '../../global/types'
import { useOutletContext } from 'react-router-dom'
import Alert, { alertReset } from '../Alert'
import { url } from '../../utils/url'
import LoadingWheel from '../LoadingWheel'
import { title } from '../../utils/utils'
import { flagBFToPerms } from '../../utils/permissions'

const User = () => {

    const { user } = useOutletContext<AppOutletContext>()

    const [userId, setUserId] = React.useState<string>()
    const [usersData, setUsersData] = React.useState<UserData>()

    const [permissionsArr, setPermissionsArr] = React.useState<string[]>()
    const [updatedPermissions, setUpdatedPermissions] = React.useState<string[]>()

    const [servicePermissionsArr, setServicePermissionsArr] = React.useState<string[]>()
    const [updatedServicePermissions, setUpdatedServicePermissions] = React.useState<string[]>()

    const [permissions, setPermissions] = React.useState<Permissions>()
    const [servicesPermissions, setServicesPermissions] = React.useState<Permissions>()
    const [permissionsLoaded, setPermissionsLoaded] = React.useState<{ id: boolean, perm: boolean, serv: boolean }>({ id: false, perm: false, serv: false })

    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    React.useEffect(() => {

        const splitLoc = location.pathname.split("/")
        const id = splitLoc[splitLoc.length - 1]

        setUserId(id)

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
        if (userId !== undefined) {
            setPermissionsLoaded((prev) => ({ ...prev, id: true }))
        }

        if (permissions !== undefined) {
            setPermissionsLoaded((prev) => ({ ...prev, perm: true }))
        }

        if (servicesPermissions !== undefined) {
            setPermissionsLoaded((prev) => ({ ...prev, serv: true }))
        }
    }, [userId, permissions, servicesPermissions])

    React.useEffect(() => {
        if (permissionsLoaded.id !== true || permissionsLoaded.perm !== true || permissionsLoaded.serv !== true) return

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
                    setPermissionsArr(flagBFToPerms(data.data.perm_flag, permissions!))
                    setUpdatedPermissions(flagBFToPerms(data.data.perm_flag, permissions!))
                    setServicePermissionsArr(flagBFToPerms(data.data.services_flag, servicesPermissions!))
                    setUpdatedServicePermissions(flagBFToPerms(data.data.services_flag, servicesPermissions!))
                })
            }
        })
    }, [permissionsLoaded])

    const updateUserPermissions = () => {

    }

    const updateUserServicePermissions = () => {

    }

    const compareArray = (arr1: any[], arr2: any[]) => {
        if (arr1.length !== arr2.length) return false

        arr1 = arr1.sort()
        arr2 = arr2.sort()

        let same = true
        for (let i in arr1) {
            if (arr1[i] !== arr2[i]) {
                same = false
                break
            }
        }
        return same
    }

    return (
        <div>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
            {
                usersData &&
                    permissions &&
                    servicesPermissions &&
                    permissionsArr &&
                    servicePermissionsArr &&
                    updatedPermissions &&
                    updatedServicePermissions
                    ?
                    <div>
                        <div className='p-[10px] bg-bgdark rounded-md w-full mb-[10px]'>
                            <div className='text-xl'>User Information</div>
                            <div className='flex flex-wrap'>
                                {
                                    Object.keys(usersData).map((key, index) => {
                                        return (
                                            <div key={index} className='w-1/3 my-[10px]'>
                                                <div className='opacity-60'>{title(key)}</div>
                                                <div>{usersData[key as keyof typeof usersData]}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='p-[10px] bg-bgdark rounded-md w-full mb-[10px]'>
                            <div className='text-xl'>Change Permissions</div>
                            <div className='flex flex-wrap'>
                                {
                                    Object.values(permissions).map((perm, index) => {
                                        return (
                                            <div key={index} className='flex-grow my-[10px]'>
                                                <div className='fc'>
                                                    {perm}
                                                </div>

                                                <div className='fc m-[5px]'>
                                                    <input
                                                        type="checkbox"
                                                        className='h-5 w-5 accent-main'
                                                        checked={updatedPermissions?.includes(perm)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setUpdatedPermissions((prev) => ([...(prev as string[]), perm]))
                                                            } else {
                                                                setUpdatedPermissions((prev) => (prev?.filter((prevPerm) => prevPerm !== perm)))
                                                            }
                                                        }}
                                                    >
                                                    </input>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <button
                                    className='button disabled:hover:bg-main disabled:opacity-50 mr-[10px]'
                                    disabled={compareArray(permissionsArr, updatedPermissions)}
                                    onClick={() => updateUserPermissions()}
                                >
                                    Update User
                                </button>
                            </div>
                        </div>
                        <div className='p-[10px] bg-bgdark rounded-md w-full mb-[10px]'>
                            <div className='text-xl'>
                                Change Service Permissions
                                <div className='text-hr text-xs'>Ticked means disabled</div>
                            </div>
                            <div>
                                {
                                    Object.values(servicesPermissions).map((perm, index) => {
                                        return (
                                            <div key={index} className='flex-grow my-[10px]'>
                                                <div className='fc'>
                                                    {perm}
                                                </div>

                                                <div className='fc m-[5px]'>
                                                    <input
                                                        type="checkbox"
                                                        className='h-5 w-5 accent-main'
                                                        checked={updatedServicePermissions?.includes(perm)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setUpdatedServicePermissions((prev) => ([...(prev as string[]), perm]))
                                                            } else {
                                                                setUpdatedServicePermissions((prev) => (prev?.filter((prevPerm) => prevPerm !== perm)))
                                                            }
                                                        }}
                                                    >
                                                    </input>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <button
                                    className='button disabled:hover:bg-main disabled:opacity-50 mr-[10px]'
                                    disabled={compareArray(servicePermissionsArr, updatedServicePermissions)}
                                    onClick={() => updateUserServicePermissions()}
                                >
                                    Update User
                                </button>
                            </div>
                        </div>
                    </div>
                    :
                    <LoadingWheel />
            }
        </div>
    )
}

export default User