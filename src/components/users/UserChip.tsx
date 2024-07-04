import React from 'react'
import { _Alert, AppOutletContext, Permissions, UserData } from '../../global/types'
import { flagBFToPerms } from '../../utils/permissions'
import LoadingWheel from '../LoadingWheel'
import { url } from '../../utils/url'
import { alertReset } from '../Alert'
import { Link, useOutletContext } from 'react-router-dom'

interface UserChipProps {
    userData: UserData,
    permissions: Permissions,
    setUsers: React.Dispatch<React.SetStateAction<UserData[] | undefined>>,
    setAlert: React.Dispatch<React.SetStateAction<_Alert>>
}

const UserChip = ({ userData, permissions, setUsers, setAlert }: UserChipProps) => {

    const { user } = useOutletContext<AppOutletContext>()

    const [permissionArr, setPermissionArr] = React.useState<string[]>()
    const [changes, setChanges] = React.useState<boolean>(false)
    const [updatedPermissions, setUpdatedPermissions] = React.useState<string[]>()

    React.useEffect(() => {
        if (!permissions) return
        const perms = flagBFToPerms(userData.perm_flag, permissions)
        setPermissionArr(perms)
        setUpdatedPermissions(perms)
    }, [permissions])

    React.useEffect(() => {
        if (!updatedPermissions || !permissionArr) return
        setChanges(updatedPermissions.length !== permissionArr.length)
    }, [updatedPermissions])

    const updateUser = () => {
        fetch(url("admin") + "user/permissions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            },
            body: JSON.stringify({
                id: userData.id,
                new_perms: updatedPermissions
            })
        }).then((res) => {
            if (!res.ok) {
                res.json().then((data) => {
                    setAlert([[`An error occured when changing ${userData.username}${userData.username.endsWith("s") ? "'" : "'s"} permissions.`, (data.error instanceof Array ? data.error[0] : data.error)], "ERROR", true])

                    setUpdatedPermissions(permissionArr)

                    setTimeout(() => {
                        setAlert(alertReset)
                    }, 5000)
                })
            } else {
                res.json().then((data) => {
                    setAlert([`Successfully changed ${userData.username}${userData.username.endsWith("s") ? "'" : "'s"} permissions.`, "SUCCESS", true])

                    setUsers((prevUsers) => (prevUsers?.map((prevUser) => {
                        if (prevUser.id !== userData.id) {
                            return prevUser
                        } else {
                            return data.data as UserData
                        }
                    })))

                    const perms = flagBFToPerms(data.data.perm_flag, permissions)
                    setPermissionArr(perms)
                    setUpdatedPermissions(perms)

                    setTimeout(() => {
                        setAlert(alertReset)
                    }, 5000)
                })
            }
        }).catch(() => {
            setAlert([`An error occured when changing ${userData.username}${userData.username.endsWith("s") ? "'" : "'s"} permissions.`, "ERROR", true])

            setTimeout(() => {
                setAlert(alertReset)
            }, 5000)
        })
    }

    return (
        <div
            className={'bg-bgdark p-[10px] my-[10px] rounded-md w-full h-full flex flex-col' + (permissionArr && !permissionArr.includes("ACTIVE") ? " border-solid border-error border-[2px]" : " border-solid border-bgdark border-[2px]")}
        >
            <div className='text-xl'>
                {userData.username}
            </div>
            <div className='text-xs text-hr'>
                {userData.email} | {userData.id}
            </div>
            <div className='bg-hr h-[2px] w-full border-none my-[5px]'></div>
            <div className='text-lg'>
                Permissions
            </div>
            <div className='h-full'>
                {
                    permissionArr && permissions && updatedPermissions ?
                        <div className='flex flex-col h-full'>
                            <div>
                                {
                                    Object.values(permissions).map((perm, index) => {
                                        return (
                                            <div key={index} className='fc flex-row'>
                                                <div
                                                    className={(permissionArr.includes(perm) ? "text-softsuccess" : "text-softerror") + " w-[60px]"}
                                                >{perm}</div>
                                                <hr className='' />
                                                <div className='w-[25px] fc'>
                                                    <input
                                                        type="checkbox"
                                                        className='h-4 w-4 accent-main'
                                                        checked={updatedPermissions ? updatedPermissions.includes(perm) : false}
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
                            </div>
                            <div className='mt-auto flex flex-row'>
                                <button
                                    className='button disabled:hover:bg-main disabled:opacity-50 mr-[10px]'
                                    disabled={!changes}
                                    onClick={() => updateUser()}
                                >
                                    Update User
                                </button>
                                <button
                                    className='button bg-warning hover:bg-warningdark disabled:hover:bg-warning disabled:opacity-50 ml-[10px]'
                                    disabled={!changes}
                                    onClick={() => {
                                        setUpdatedPermissions(permissionArr)
                                    }}
                                >
                                    Reset Changes
                                </button>
                            </div>
                            <Link to={"/user/" + userData.id}>
                                <button
                                    className='button bg-main hover:bg-maindark disabled:hover:bg-main disabled:opacity-50'
                                >
                                    View User
                                </button>
                            </Link>
                        </div>
                        :
                        <LoadingWheel size={30} />
                }
            </div>
        </div>
    )
}

export default UserChip