import React from 'react'
import { useUser } from '../../App'

const Home = () => {
    const { user } = useUser()

    React.useEffect(() => {
        console.log(user)
    }, [])

    return (
        <div>Home</div>
    )
}

export default Home