import React from 'react'
import { _Alert, Permissions, UserData } from '../../global/types'
import { useUser } from '../../App'
import { flagBFToPerms } from '../../utils/permissions'
import LoadingWheel from '../LoadingWheel'
import { url } from '../../utils/url'
import { alertReset } from '../Alert'

interface UserChipProps {
    userData: UserData,
    permissions: Permissions,
    setUsers: React.Dispatch<React.SetStateAction<UserData[] | undefined>>,
    setAlert: React.Dispatch<React.SetStateAction<_Alert>>
}

const UserChip = ({ userData, permissions, setUsers, setAlert }: UserChipProps) => {

    const { user } = useUser()

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
        fetch(url("admin") + "user/change-permissions", {
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
                                                    className={(permissionArr.includes(perm) ? "text-softsuccess" : "text-softerror") + " w-[10%]"}
                                                >{perm}</div>
                                                <hr className=' mx-[5px] max-w-[394px] ml-auto w-[85%]' />
                                                <div className='w-[5%] fc'>
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
                        </div>
                        :
                        <LoadingWheel size={30} />
                }
            </div>
        </div>
    )
}

export default UserChip