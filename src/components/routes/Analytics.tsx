import React from 'react'
import { _Alert, _Analytics, AnalyticSettings, AnalyticsMetaData, AppOutletContext, LoginFailObject } from '../../global/types'
import { url } from '../../utils/url'
import Alert, { alertReset } from '../Alert'
import { useOutletContext } from 'react-router-dom'
import LoadingWheel from '../LoadingWheel'
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts'
import LoginsTooltip from '../analytics/LoginsTooltip'
import { Tab, TabGroup, TabList } from '@headlessui/react'
import { reverse } from '../../utils/utils'

export const lineColours = {
    total: "#8884d8",
    success: "#73d673",
    fail: "#f7665f",
    created: "#f7e15e",
    INVALID_BODY: "#ffbc8a",
    INCORRECT_IDENTIFIER: "#dae7b0",
    INCORRECT_PASSWORD: "#e7a1f1",
    INSUFFICIENT_PERMISSIONS: "#bde4ee",
    DISABLED_ACCOUNT: "#ba84ae",
    INSUFFICIENT_SERVICE_PERMISSIONS: "#a783ff"
}

const failTypes = ["INVALID_BODY", "INCORRECT_IDENTIFIER", "INCORRECT_PASSWORD", "INSUFFICIENT_PERMISSIONS", "DISABLED_ACCOUNT", "INSUFFICIENT_SERVICE_PERMISSIONS"]

const Analytics = () => {

    const { user } = useOutletContext<AppOutletContext>()

    const [analytics, setAnalytics] = React.useState<_Analytics>({ logins: {}, tables: {}, loginFails: {} })
    const [analyticsMetaData, setAnalyticsMetaData] = React.useState<AnalyticsMetaData>({ logins: { maxValue: 0, successTotal: 0, failTotal: 0 } })
    const [analyticSettings, setAnalyticSettings] = React.useState<AnalyticSettings>({ logins: { timeframe: "MONTH", type: "ALL" }, tables: { timeframe: "MONTH", type: "TOTAL" } })
    const [rechartsData, setRechartsData] = React.useState<any>({ logins: {}, tables: {}, loginFails: {} })

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
                timeframe: analyticSettings.logins.timeframe
            })
        }).then((res) => {
            if (!res.ok) {
                setAlert(["Could not fetch login analytics.", "ERROR", true])
                setTimeout(() => {
                    setAlert(alertReset)
                }, 5000)
            } else {
                res.json().then((data) => {
                    let max = 0
                    let successTotal = 0
                    let failTotal = 0
                    setAnalytics((prevAnalytics) => (
                        {
                            logins: data.data,
                            tables: prevAnalytics.tables,
                            loginFails: prevAnalytics.loginFails
                        }
                    ))
                    const formattedLoginData: any[] = []
                    for (let i of Object.keys(data.data)) {
                        if (data.data[i].total > max) {
                            max = data.data[i].total
                        }
                        successTotal += data.data[i].success
                        failTotal += data.data[i].fail
                        formattedLoginData.push({
                            name: i,
                            fail: data.data[i].fail,
                            success: data.data[i].success,
                            total: data.data[i].total
                        })
                    }
                    setAnalyticsMetaData({ logins: { maxValue: max, successTotal, failTotal } })
                    setRechartsData((prevData: any) => (
                        {
                            logins: reverse(formattedLoginData),
                            tables: prevData.tables,
                            loginFails: prevData.loginFails
                        }
                    ))
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
                setAlert(["Could not fetch table analytics.", "ERROR", true])
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
                    setAnalytics((prevAnalytics) => (
                        {
                            logins: prevAnalytics.logins,
                            tables: analyticsData,
                            loginFails: prevAnalytics.loginFails
                        }
                    ))

                    setRechartsData((prevData: any) => (
                        {
                            logins: prevData.logins,
                            tables: formattedTableData,
                            loginFails: prevData.loginFails
                        }
                    ))
                })
            }
        })



        // fetch login fail analytics
        fetch(url("admin") + "analytics/login/fails", {
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
                setAlert(["Could not fetch login fails analytics.", "ERROR", true])
                setTimeout(() => {
                    setAlert(alertReset)
                }, 5000)
            } else {
                res.json().then((data) => {
                    setAnalytics((prevAnalytics) => (
                        {
                            logins: prevAnalytics.logins,
                            tables: prevAnalytics.tables,
                            loginFails: data.data
                        }
                    ))

                    const total: LoginFailObject = {
                        INVALID_BODY: 0,
                        INCORRECT_IDENTIFIER: 0,
                        INCORRECT_PASSWORD: 0,
                        INSUFFICIENT_PERMISSIONS: 0,
                        DISABLED_ACCOUNT: 0,
                        INSUFFICIENT_SERVICE_PERMISSIONS: 0
                    }

                    const formattedFailData: any[] = []

                    for (let i of Object.keys(data.data)) {
                        const innerData = data.data[i]
                        for (let j of Object.keys(innerData)) {
                            total[j as keyof LoginFailObject] += innerData[j]
                        }
                    }

                    for (let i of Object.keys(total)) {
                        formattedFailData.push({
                            name: i,
                            total: total[i as keyof LoginFailObject]
                        })
                    }

                    setRechartsData((prevData: any) => (
                        {
                            logins: prevData.logins,
                            tables: prevData.tables,
                            loginFails: formattedFailData
                        }
                    ))
                    console.log(formattedFailData)
                })
            }
        })
    }, [])



    const formatName = (name: string) => {
        const SPLIT_LENGTH = 15
        let buffer = ""

        for (let i of name) {
            if ((buffer.length + 1) % (SPLIT_LENGTH - 2) === 0) { // subtract 2 to add some padding around the word
                buffer += i
                buffer += " "
            } else {
                buffer += i
            }
        }
        return buffer
    }



    return (
        <div className='outlet overflow-y-auto'>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
            {
                Object.keys(analytics.logins).length !== 0 && Object.keys(analytics.tables).length !== 0 ?
                    <div className='flex flex-wrap pr-[5px]'>

                        <div className='flex flex-wrap justify-between w-full mb-[10px]'>
                            <div className='w-[calc(200%/3-5px)] h-[560px] bg-bgdark pl-[30px] pr-[70px] py-[20px] rounded-md'>
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
                                        dy={analyticSettings.logins.timeframe === "MONTH" ? 35 : 50}
                                        dx={5}
                                        height={125}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        domain={[0, Math.ceil((analyticsMetaData.logins.maxValue) / 10) * 10] /*this might break as the numbers get bigger not sure might just remove it*/}
                                        tickCount={12}
                                    />
                                </LineChart>
                            </div>

                            <div className='w-[calc(100%/3-5px)] h-[560px] p-[20px] bg-bgdark rounded-md overflow-auto'>
                                <div className='flex flex-row h-[80px]'>
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
                                                <div className='flex flex-row h-[40px]'>
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
                                <div>
                                    <div className='flex flex-row h-[40px]'>
                                        <div className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'>Total</div>
                                        <div
                                            className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                            style={{
                                                color: lineColours.total,
                                                backgroundColor: (analyticSettings.logins.type === "TOTAL" ? "#f7e15e" : ""),
                                                borderTopColor: (analyticSettings.logins.type === "TOTAL" ? "#f7e15e" : ""),
                                                borderBottomColor: (analyticSettings.logins.type === "TOTAL" ? "#f7e15e" : "")
                                            }}
                                        >{analyticsMetaData.logins.successTotal + analyticsMetaData.logins.failTotal}</div>
                                        <div
                                            className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                            style={{
                                                color: lineColours.success,
                                                backgroundColor: (analyticSettings.logins.type === "SUCCESS" ? "#f7e15e" : ""),
                                                borderTopColor: (analyticSettings.logins.type === "SUCCESS" ? "#f7e15e" : ""),
                                                borderBottomColor: (analyticSettings.logins.type === "SUCCESS" ? "#f7e15e" : "")
                                            }}
                                        >{analyticsMetaData.logins.successTotal}</div>
                                        <div
                                            className='w-[40%] border-solid border-hr border-[1px] flex justify-center items-center'
                                            style={{
                                                color: lineColours.fail,
                                                backgroundColor: (analyticSettings.logins.type === "FAIL" ? "#f7e15e" : ""),
                                                borderTopColor: (analyticSettings.logins.type === "FAIL" ? "#f7e15e" : ""),
                                                borderBottomColor: (analyticSettings.logins.type === "FAIL" ? "#f7e15e" : "")
                                            }}
                                        >{analyticsMetaData.logins.failTotal}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*-------------------------------------------------------------------------------------------------*/}

                        <div className='flex flex-wrap justify-between w-full mb-[10px]'>
                            <div className='w-[calc(100%/3-5px)] h-[560px] bg-bgdark pl-[30px] pr-[70px] py-[20px] rounded-md'>
                                <div className='flex flex-col justify-between mb-[10px]'>
                                    <div className='text-2xl w-[250px]'>Login Fail Reasons</div>
                                    <div className='text-hr'>
                                        Totaled login fail reasons over the last 10 {analyticSettings.logins.timeframe === "MONTH" ? "months" : "days"}
                                    </div>
                                </div>
                                <div>
                                    <PieChart width={450} height={450}>
                                        <Pie data={rechartsData.loginFails} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={50} label >
                                            {
                                                failTypes.map((entry: any, index: number) => {
                                                    return (
                                                        <Cell key={index} fill={lineColours[entry as keyof typeof lineColours]} />
                                                    )
                                                })
                                            }
                                        </Pie>
                                        <Legend verticalAlign="top" height={36} />
                                    </PieChart>
                                </div>
                            </div>

                            <div className='w-[calc(200%/3-5px)] h-[560px] bg-bgdark pl-[30px] pr-[70px] py-[20px] rounded-md overflow-auto'>
                                <div className='flex flex-col justify-between mb-[10px]'>
                                    <div className='text-2xl w-[250px]'>Login Fail Reasons</div>
                                    <div className='text-hr'>
                                        Login fail reasons per {analyticSettings.logins.timeframe === "MONTH" ? "month" : "day"} for the last 10 {analyticSettings.logins.timeframe === "MONTH" ? "months" : "days"}
                                    </div>
                                </div>
                                <div className='flex flex-row'>
                                    <div
                                        className='w-[10%] border-solid border-hr border-[1px] flex justify-center items-center'
                                    >
                                        Date
                                    </div>
                                    {
                                        failTypes.map((type, index) => {
                                            return (
                                                <div
                                                    className='w-[15%] h-[70px] border-solid border-hr border-[1px] flex justify-center items-center text-center'
                                                    key={index}
                                                    style={{
                                                        color: lineColours[type as keyof typeof lineColours]
                                                    }}
                                                >
                                                    {formatName(type)}
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                                {
                                    Object.keys(analytics.loginFails).length > 0 ?
                                        <div>
                                            {
                                                Object.keys(analytics.loginFails).map((key, index) => {
                                                    return (
                                                        <div className='flex flex-row' key={index}>
                                                            <div
                                                                className='w-[10%] border-solid border-hr border-[1px] flex justify-center items-center'
                                                            >{key}</div>
                                                            {
                                                                Object.keys(analytics.loginFails[key]).map((childKey, childIndex) => {
                                                                    const data = analytics.loginFails[key][childKey as keyof LoginFailObject]
                                                                    return (
                                                                        <div
                                                                            className='w-[15%] border-solid border-hr border-[1px] flex justify-center items-center'
                                                                            key={childIndex}
                                                                            style={{
                                                                                color: lineColours[childKey as keyof typeof lineColours]
                                                                            }}
                                                                        >
                                                                            {data}
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <div className='mt-[20px]'>
                                            <LoadingWheel />
                                        </div>
                                }
                            </div>

                        </div>

                        {/*-------------------------------------------------------------------------------------------------*/}

                        <div className='flex flex-wrap justify-between w-full mb-[10px]'>
                            <div className='w-[calc(200%/3-5px)] h-[560px] bg-bgdark pl-[30px] pr-[70px] py-[20px] rounded-md'>
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
                                    {/*<Tooltip content={<LoginsTooltip data={analytics} />} />*/}
                                    <CartesianGrid stroke="#ccc" strokeOpacity={30} strokeWidth={1} />
                                    <XAxis
                                        dataKey="name"
                                        angle={90}
                                        dy={analyticSettings.logins.timeframe === "MONTH" ? 35 : 50}
                                        dx={5}
                                        height={125}
                                    />
                                    <YAxis allowDecimals={false} />
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
