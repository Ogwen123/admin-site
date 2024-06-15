import React from 'react'
import { _Alert, _Analytics, AnalyticSettings, RechartData } from '../../global/types'
import { url } from '../../utils/url'
import Alert, { alertReset } from '../Alert'
import { useUser } from '../../App'
import LoadingWheel from '../LoadingWheel'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import CustomTooltip from '../analytics/CustomTooltip'
import { Tab, TabGroup, TabList } from '@headlessui/react'

export const lineColours = {
    total: "#8884d8",
    success: "#73d673",
    fail: "#f7665f"
}

const Analytics = () => {

    const { user } = useUser()

    const [analytics, setAnalytics] = React.useState<_Analytics>()
    const [analyticSettings, setAnalyticSettings] = React.useState<AnalyticSettings>({ timeframe: "MONTH", type: "ALL" })
    const [rechartsData, setRechartsData] = React.useState<any>()

    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    React.useEffect(() => {
        // fetch login analytics
        fetch(url("admin") + "analytics/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            },
            body: JSON.stringify({
                timeframe: analyticSettings.timeframe
            })
        }).then((res) => {
            if (!res.ok) {
                setAlert(["Could not fetch analytics.", "ERROR", true])
                setTimeout(() => {
                    setAlert(alertReset)
                }, 5000)
            } else {
                res.json().then((data) => {
                    setAnalytics({ logins: data.data })
                    const formattedData: any[] = []
                    for (let i of Object.keys(data.data)) {
                        formattedData.push({
                            name: i,
                            fail: data.data[i].fail,
                            success: data.data[i].success,
                            total: data.data[i].total
                        })
                    }
                    setRechartsData(formattedData.reverse())
                })
            }
        })
    }, [])

    return (
        <div>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
            {
                analytics ?
                    <div className='flex flex-wrap justify-between'>

                        <div className='w-[1000px] h-[560px] bg-bgdark pl-[30px] pr-[70px] py-[20px] rounded-md'>
                            <div className='flex flex-row justify-between mb-[10px]'>
                                <div className='text-2xl ml-[70px] w-[100px]'>Logins</div>
                                <TabGroup onChange={(index) => {
                                    switch (index) {
                                        case 0:
                                            setAnalyticSettings((prevSettings) => ({ ...prevSettings, type: "ALL" }))
                                            break;
                                        case 1:
                                            setAnalyticSettings((prevSettings) => ({ ...prevSettings, type: "TOTAL" }))
                                            break;
                                        case 2:
                                            setAnalyticSettings((prevSettings) => ({ ...prevSettings, type: "SUCCESS" }))
                                            break;
                                        case 3:
                                            setAnalyticSettings((prevSettings) => ({ ...prevSettings, type: "FAIL" }))
                                            break;
                                        default:
                                            setAnalyticSettings((prevSettings) => ({ ...prevSettings, type: "ALL" }))
                                            break;
                                    }
                                }}
                                >
                                    <TabList className="flex gap-4">
                                        <Tab
                                            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-main data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                        >
                                            All
                                        </Tab>
                                        <Tab
                                            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-main data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                        >
                                            Total
                                        </Tab>
                                        <Tab
                                            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-main data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                        >
                                            Success
                                        </Tab>
                                        <Tab
                                            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-main data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                        >
                                            Fail
                                        </Tab>

                                    </TabList>
                                </TabGroup>
                            </div>
                            <LineChart width={900} height={500} data={rechartsData}>
                                {
                                    analyticSettings.type === "ALL" || analyticSettings.type === "TOTAL" ?
                                        <Line type="monotone" dataKey="total" stroke={lineColours.total} strokeWidth={2} />
                                        :
                                        <div></div>
                                }

                                {
                                    analyticSettings.type === "ALL" || analyticSettings.type === "SUCCESS" ?
                                        <Line type="monotone" dataKey="success" stroke={lineColours.success} strokeWidth={2} />
                                        :
                                        <div></div>
                                }

                                {
                                    analyticSettings.type === "ALL" || analyticSettings.type === "FAIL" ?
                                        <Line type="monotone" dataKey="fail" stroke={lineColours.fail} strokeWidth={2} />
                                        :
                                        <div></div>
                                }
                                <Tooltip content={<CustomTooltip data={analytics} />} />
                                <CartesianGrid stroke="#ccc" strokeOpacity={30} strokeWidth={1} />
                                <XAxis
                                    dataKey="name"
                                    angle={90}
                                    dy={35}
                                    dx={5}
                                    height={100}
                                />
                                <YAxis />
                            </LineChart>
                        </div>
                        <div className='w-[600px] h-[560px] p-[20px] bg-bgdark rounded-md'>
                            <div className='flex flex-row h-[70px]'>
                                <div className='w-[40%] border-solid border-hr border-[1px] flex justify-center'>Date Range</div>
                                <div
                                    className='w-[40%] border-solid border-hr border-[1px] flex justify-center'
                                    style={{
                                        color: lineColours.total,
                                        backgroundColor: (analyticSettings.type === "TOTAL" ? "#f7e15e" : "")
                                    }}
                                >Total</div>
                                <div
                                    className='w-[40%] border-solid border-hr border-[1px] flex justify-center'
                                    style={{
                                        color: lineColours.success,
                                        backgroundColor: (analyticSettings.type === "SUCCESS" ? "#f7e15e" : "")
                                    }}
                                >Success</div>
                                <div
                                    className='w-[40%] border-solid border-hr border-[1px] flex justify-center'
                                    style={{
                                        color: lineColours.fail,
                                        backgroundColor: (analyticSettings.type === "FAIL" ? "#f7e15e" : "")
                                    }}
                                >Fail</div>
                            </div>
                            {
                                Object.keys(analytics.logins).map((key, index) => {
                                    console.log(key)
                                    const data = analytics.logins[key]
                                    return (
                                        <div key={index}>
                                            <div className='flex flex-row h-[45px]'>
                                                <div className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'>{key}</div>
                                                <div
                                                    className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                                    style={{
                                                        color: lineColours.total,
                                                        backgroundColor: (analyticSettings.type === "TOTAL" ? "#f7e15e" : ""),
                                                        borderTopColor: (analyticSettings.type === "TOTAL" ? "#f7e15e" : ""),
                                                        borderBottomColor: (analyticSettings.type === "TOTAL" ? "#f7e15e" : "")
                                                    }}
                                                >{data.total}</div>
                                                <div
                                                    className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                                    style={{
                                                        color: lineColours.success,
                                                        backgroundColor: (analyticSettings.type === "SUCCESS" ? "#f7e15e" : ""),
                                                        borderTopColor: (analyticSettings.type === "SUCCESS" ? "#f7e15e" : ""),
                                                        borderBottomColor: (analyticSettings.type === "SUCCESS" ? "#f7e15e" : "")
                                                    }}
                                                >{data.success}</div>
                                                <div
                                                    className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                                    style={{
                                                        color: lineColours.fail,
                                                        backgroundColor: (analyticSettings.type === "FAIL" ? "#f7e15e" : ""),
                                                        borderTopColor: (analyticSettings.type === "FAIL" ? "#f7e15e" : ""),
                                                        borderBottomColor: (analyticSettings.type === "FAIL" ? "#f7e15e" : "")
                                                    }}
                                                >{data.fail}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                    :
                    <div className='my-[10px] fc w-full'>
                        <LoadingWheel />
                    </div>

            }
        </div>
    )
}

export default Analytics