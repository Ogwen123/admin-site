import React from 'react'
import { Permissions, UserData } from '../../global/types'
import { useUser } from '../../App'
import { flagBFToPerms } from '../../utils/permissions'
import LoadingWheel from '../LoadingWheel'

interface UserChipProps {
    userData: UserData,
    permissions: Permissions | undefined
}

const UserChip = ({ userData, permissions }: UserChipProps) => {

    const { user } = useUser()

    const [permissionArr, setPermissionArr] = React.useState<string[]>()

    React.useEffect(() => {
        if (!permissions) return
        setPermissionArr(flagBFToPerms(userData.perm_flag, permissions))
    }, [permissions])

    return (
        <div
            className='bg-bgdark p-[10px] my-[10px] rounded-md'
        >
            {userData.username} | {userData.email}
            <div>
                {
                    permissionArr ?
                        permissionArr.map((perm, index) => {
                            return (
                                <div key={index}>{perm}</div>
                            )
                        })
                        :
                        <LoadingWheel size={30} />
                }
            </div>
        </div>
    )
}

export default UserChip