import React from 'react'
import { _Alert, Stats } from '../../global/types'
import LoadingWheel from '../LoadingWheel'
import StatisticChip from '../statistics/StatisticChip'
import { url } from '../../utils/url'
import { useUser } from '../../App'
import Alert, { alertReset } from '../Alert'

export const overrideLinks: { [id: string]: string } = {
    "users": "/users",
    "services": "/services"
}

const Statistics = () => {

    const { user } = useUser()

    const [stats, setStats] = React.useState<Stats>()

    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    React.useEffect(() => {
        fetch(url("admin") + "stats", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + user.token
            }
        }).then((res) => {
            if (!res.ok) {
                setAlert(["Could not fetch statistics.", "ERROR", true])
                setTimeout(() => {
                    setAlert(alertReset)
                }, 5000)
            } else {
                res.json().then((data) => {
                    setStats(data.data)
                })
            }
        })
    }, [])

    return (
        <div className='overflow-auto h-[calc(100vh-90px)]'>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />

            {
                stats ?
                    <div className='w-full flex flex-wrap'>
                        {
                            Object.entries(stats).map(([key, value], index) => {
                                return (
                                    <StatisticChip name={key} value={value} key={index} side={index % 2 == 0 ? "LEFT" : "RIGHT"} />
                                )
                            })
                        }
                    </div>
                    :
                    <div className='w-full h-[200px] fc'>
                        <LoadingWheel />
                    </div>
            }
        </div>
    )
}

export default Statistics