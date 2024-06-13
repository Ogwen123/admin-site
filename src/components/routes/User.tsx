import React from 'react'
import { UserData } from '../../global/types'

const User = () => {

    const [usersData, setUsersData] = React.useState<UserData>()

    return (
        <div>User</div>
    )
}

export default User