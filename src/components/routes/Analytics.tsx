import React from 'react'
import { _Alert, _Analytics, AnalyticSettings, AnalyticsMetaData } from '../../global/types'
import { url } from '../../utils/url'
import Alert, { alertReset } from '../Alert'
import { useUser } from '../../App'
import LoadingWheel from '../LoadingWheel'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import LoginsTooltip from '../analytics/LoginsTooltip'
import { Tab, TabGroup, TabList } from '@headlessui/react'
import { reverse } from '../../utils/utils'

export const lineColours = {
    total: "#8884d8",
    success: "#73d673",
    fail: "#f7665f",
    created: "#f7e15e"
}

const Analytics = () => {

    const { user } = useUser()

    const [analytics, setAnalytics] = React.useState<_Analytics>({ logins: {}, tables: {} })
    const [analyticsMetaData, setAnalyticsMetaData] = React.useState<AnalyticsMetaData>({ logins: { maxValue: 0 } })
    const [analyticSettings, setAnalyticSettings] = React.useState<AnalyticSettings>({ logins: { timeframe: "MONTH", type: "ALL" }, tables: { timeframe: "MONTH", type: "TOTAL" } })
    const [rechartsData, setRechartsData] = React.useState<any>({ logins: {}, tables: {} })

    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    React.useEffect(() => {
        console.log(rechartsData.tables)
    }, [rechartsData])

    React.useEffect(() => {
        // fetch login analytics
        fetch(url("admin") + "analytics/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            },
            body: JSON.stringify({
                timeframe: analyticSettings.logins.timeframe
            })
        }).then((res) => {
            if (!res.ok) {
                setAlert(["Could not login fetch analytics.", "ERROR", true])
                setTimeout(() => {
                    setAlert(alertReset)
                }, 5000)
            } else {
                res.json().then((data) => {
                    let max = 0;
                    setAnalytics((prevAnalytics) => ({ logins: data.data, tables: prevAnalytics.tables }))
                    const formattedLoginData: any[] = []
                    for (let i of Object.keys(data.data)) {
                        if (data.data[i].total > max) {
                            max = data.data[i].total
                        }
                        formattedLoginData.push({
                            name: i,
                            fail: data.data[i].fail,
                            success: data.data[i].success,
                            total: data.data[i].total
                        })
                    }
                    setAnalyticsMetaData({ logins: { maxValue: max } })
                    setRechartsData((prevData: any) => ({ logins: reverse(formattedLoginData), tables: prevData.tables }))
                })
            }
        })


        // fetch tables analytics
        fetch(url("admin") + "analytics/tables", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            },
            body: JSON.stringify({
                timeframe: analyticSettings.tables.timeframe
            })
        }).then((res) => {
            if (!res.ok) {
                setAlert(["Could not table fetch analytics.", "ERROR", true])
                setTimeout(() => {
                    setAlert(alertReset)
                }, 5000)
            } else {
                res.json().then((data) => {
                    let total = 0
                    let analyticsData: any = {}
                    let formattedTableData = []
                    for (let i of reverse(Object.keys(data.data))) {
                        total += data.data[i]
                        formattedTableData.push({
                            name: i,
                            created: data.data[i],
                            total
                        })
                        analyticsData[i] = {
                            created: data.data[i],
                            total
                        }
                    }
                    setAnalytics((prevAnalytics) => ({ logins: prevAnalytics.logins, tables: analyticsData }))

                    setRechartsData((prevData: any) => ({ logins: prevData.logins, tables: formattedTableData }))
                })
            }
        })
    }, [])

    return (
        <div>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
            {
                analytics ?
                    <div className='flex flex-wrap overflow-y-scroll outlet'>

                        <div className='flex flex-wrap justify-between w-full mb-[10px]'>
                            <div className='w-[1000px] h-[560px] bg-bgdark pl-[30px] pr-[70px] py-[20px] rounded-md'>
                                <div className='flex flex-row justify-between mb-[10px]'>
                                    <div className='text-2xl ml-[70px] w-[100px]'>Logins</div>
                                    <TabGroup onChange={(index) => {
                                        switch (index) {
                                            case 0:
                                                setAnalyticSettings((prevSettings) => ({ ...prevSettings, logins: { timeframe: prevSettings.logins.timeframe, type: "ALL" } }))
                                                break;
                                            case 1:
                                                setAnalyticSettings((prevSettings) => ({ ...prevSettings, logins: { timeframe: prevSettings.logins.timeframe, type: "TOTAL" } }))
                                                break;
                                            case 2:
                                                setAnalyticSettings((prevSettings) => ({ ...prevSettings, logins: { timeframe: prevSettings.logins.timeframe, type: "SUCCESS" } }))
                                                break;
                                            case 3:
                                                setAnalyticSettings((prevSettings) => ({ ...prevSettings, logins: { timeframe: prevSettings.logins.timeframe, type: "FAIL" } }))
                                                break;
                                            default:
                                                setAnalyticSettings((prevSettings) => ({ ...prevSettings, logins: { timeframe: prevSettings.logins.timeframe, type: "ALL" } }))
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
                                <LineChart width={900} height={500} data={rechartsData.logins}>
                                    {
                                        analyticSettings.logins.type === "ALL" || analyticSettings.logins.type === "TOTAL" ?
                                            <Line type="monotone" dataKey="total" stroke={lineColours.total} strokeWidth={2} />
                                            :
                                            <div></div>
                                    }

                                    {
                                        analyticSettings.logins.type === "ALL" || analyticSettings.logins.type === "SUCCESS" ?
                                            <Line type="monotone" dataKey="success" stroke={lineColours.success} strokeWidth={2} />
                                            :
                                            <div></div>
                                    }

                                    {
                                        analyticSettings.logins.type === "ALL" || analyticSettings.logins.type === "FAIL" ?
                                            <Line type="monotone" dataKey="fail" stroke={lineColours.fail} strokeWidth={2} />
                                            :
                                            <div></div>
                                    }
                                    <Tooltip content={<LoginsTooltip data={analytics} />} />
                                    <CartesianGrid stroke="#ccc" strokeOpacity={30} strokeWidth={1} />
                                    <XAxis
                                        dataKey="name"
                                        angle={90}
                                        dy={35}
                                        dx={5}
                                        height={100}
                                    />
                                    <YAxis domain={[0, Math.round((analyticsMetaData.logins.maxValue * 1.2) / 2) * 2]} /> {/*this might break as the numbers get bigger not sure might just remove it*/}
                                </LineChart>
                            </div>
                            <div className='w-[600px] h-[560px] p-[20px] bg-bgdark rounded-md'>
                                <div className='flex flex-row h-[70px]'>
                                    <div className='w-[40%] border-solid border-hr border-[1px] flex justify-center'>Date Range</div>
                                    <div
                                        className='w-[40%] border-solid border-hr border-[1px] flex justify-center'
                                        style={{
                                            color: lineColours.total,
                                            backgroundColor: (analyticSettings.logins.type === "TOTAL" ? "#f7e15e" : "")
                                        }}
                                    >Total</div>
                                    <div
                                        className='w-[40%] border-solid border-hr border-[1px] flex justify-center'
                                        style={{
                                            color: lineColours.success,
                                            backgroundColor: (analyticSettings.logins.type === "SUCCESS" ? "#f7e15e" : "")
                                        }}
                                    >Success</div>
                                    <div
                                        className='w-[40%] border-solid border-hr border-[1px] flex justify-center'
                                        style={{
                                            color: lineColours.fail,
                                            backgroundColor: (analyticSettings.logins.type === "FAIL" ? "#f7e15e" : "")
                                        }}
                                    >Fail</div>
                                </div>
                                {
                                    Object.keys(analytics.logins).map((key, index) => {
                                        const data = analytics.logins[key]
                                        return (
                                            <div key={index}>
                                                <div className='flex flex-row h-[45px]'>
                                                    <div className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'>{key}</div>
                                                    <div
                                                        className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                                        style={{
                                                            color: lineColours.total,
                                                            backgroundColor: (analyticSettings.logins.type === "TOTAL" ? "#f7e15e" : ""),
                                                            borderTopColor: (analyticSettings.logins.type === "TOTAL" ? "#f7e15e" : ""),
                                                            borderBottomColor: (analyticSettings.logins.type === "TOTAL" ? "#f7e15e" : "")
                                                        }}
                                                    >{data.total}</div>
                                                    <div
                                                        className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                                        style={{
                                                            color: lineColours.success,
                                                            backgroundColor: (analyticSettings.logins.type === "SUCCESS" ? "#f7e15e" : ""),
                                                            borderTopColor: (analyticSettings.logins.type === "SUCCESS" ? "#f7e15e" : ""),
                                                            borderBottomColor: (analyticSettings.logins.type === "SUCCESS" ? "#f7e15e" : "")
                                                        }}
                                                    >{data.success}</div>
                                                    <div
                                                        className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                                        style={{
                                                            color: lineColours.fail,
                                                            backgroundColor: (analyticSettings.logins.type === "FAIL" ? "#f7e15e" : ""),
                                                            borderTopColor: (analyticSettings.logins.type === "FAIL" ? "#f7e15e" : ""),
                                                            borderBottomColor: (analyticSettings.logins.type === "FAIL" ? "#f7e15e" : "")
                                                        }}
                                                    >{data.fail}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='flex flex-wrap justify-between w-full mb-[10px]'>
                            <div className='w-[1000px] h-[560px] bg-bgdark pl-[30px] pr-[70px] py-[20px] rounded-md'>
                                <div className='flex flex-row justify-between mb-[10px]'>
                                    <div className='text-2xl ml-[70px] w-[100px]'>Tables</div>
                                    <TabGroup onChange={(index) => {
                                        switch (index) {
                                            case 0:
                                                setAnalyticSettings((prevSettings) => ({ ...prevSettings, tables: { timeframe: prevSettings.logins.timeframe, type: "TOTAL" } }))
                                                break;
                                            case 1:
                                                setAnalyticSettings((prevSettings) => ({ ...prevSettings, tables: { timeframe: prevSettings.logins.timeframe, type: "CREATED" } }))
                                                break;
                                            default:
                                                setAnalyticSettings((prevSettings) => ({ ...prevSettings, tables: { timeframe: prevSettings.logins.timeframe, type: "TOTAL" } }))
                                                break;
                                        }
                                    }}
                                    >
                                        <TabList className="flex gap-4">
                                            <Tab
                                                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-main data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                            >
                                                Total
                                            </Tab>
                                            <Tab
                                                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-main data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                            >
                                                Created in
                                            </Tab>

                                        </TabList>
                                    </TabGroup>
                                </div>
                                <LineChart width={900} height={500} data={rechartsData.tables}>
                                    {
                                        analyticSettings.tables.type === "TOTAL" ?
                                            <Line type="monotone" dataKey="total" stroke={lineColours.total} strokeWidth={2} />
                                            :
                                            <div></div>
                                    }

                                    {
                                        analyticSettings.tables.type === "CREATED" ?
                                            <Line type="monotone" dataKey="created" stroke={lineColours.created} strokeWidth={2} />
                                            :
                                            <div></div>
                                    }
                                    <Tooltip content={<LoginsTooltip data={analytics} />} />
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