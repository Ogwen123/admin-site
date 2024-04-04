import React from 'react'
import { ServicesFilters, ShallowServiceData, _Alert } from '../../global/types'
import { url } from '../../utils/url'
import { useUser } from '../../App'
import Alert, { alertReset } from '../Alert'
import LoadingWheel from '../LoadingWheel'
import { Listbox } from '@headlessui/react'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import ServiceChip from '../services/ServiceChip'
import { Link } from 'react-router-dom'

const initalFilter: ServicesFilters = { search: "", filter: "NONE" }

const Services = () => {
    const { user, updateSidebar, setUpdateSidebar } = useUser()

    const [services, setServices] = React.useState<ShallowServiceData[]>()
    const [shownServices, setShownServices] = React.useState<ShallowServiceData[]>()
    const [filters, setFilters] = React.useState<ServicesFilters>(initalFilter)

    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    React.useEffect(() => {
        if (localStorage.getItem("services") !== null) { // cache the services in localstorage and fetch them if cache is more than 10 seconds old
            const serviceData = JSON.parse(localStorage.getItem("services")!)
            if (serviceData.timeGot < Date.now() - 10 * 1000) {
                fetchServices()
                return
            } else {
                setServices(serviceData.services)
                setShownServices(serviceData.services)
            }
        } else {
            fetchServices()
            return
        }
    }, [])

    React.useEffect(() => {
        if (!services) return
        setShownServices(filter(services))
    }, [filters])

    React.useEffect(() => {
        if (!services) {
            setShownServices(services)
            return
        }
        setShownServices(filter(services))
    }, [services])

    const filter = (toFilter: ShallowServiceData[]): ShallowServiceData[] => {
        let results = toFilter
        if (filters.search !== "") {
            results = results?.filter((service) => {
                return service.alias.toLowerCase().includes(filters.search)
            })
        }

        if (filters.filter !== "NONE") {
            results = results.filter((service) => {
                return filters.filter === service.type
            })
        }
        return results
    }

    const fetchServices = async () => {
        const res = await fetch(url("admin") + "services", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + user.token
            }
        })

        if (!res.ok) {
            setAlert(["Error when fetching services.", "ERROR", true])
            setTimeout(() => {
                setAlert(alertReset)
            }, 2000)
            return
        }

        const data = await res.json()

        const serviceData = data.data as ShallowServiceData[]

        localStorage.setItem("services", JSON.stringify({
            timeGot: Date.now(),
            services: serviceData
        }))

        setServices(serviceData)
        setShownServices(serviceData)
    }

    return (
        <div>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
            <div className='flex flex-row w-full h-[55px] mt-[10px]'>
                <input
                    value={filters.search}
                    className='form-input w-[70%] m-0'
                    placeholder='Search'
                    onChange={(e) => {
                        setFilters((prevFilters) => ({ search: e.target.value, filter: prevFilters.filter }))
                    }}
                ></input>
                <div className='w-[15%] mx-[10px]'>
                    <Listbox
                        value={filters.filter}
                        onChange={(data) => {
                            setFilters((prevFilters) => ({ search: prevFilters.search, filter: data }))
                        }}
                    >
                        <Listbox.Button
                            className="w-full bg-bgdark h-full rounded-md fc flex-row"
                        >
                            {filters.filter !== "NONE" ? filters.filter[0] + filters.filter.slice(1).toLowerCase() : "Filter"}
                            <ChevronDownIcon
                                className='h-5 w-5'
                            />
                        </Listbox.Button>
                        <Listbox.Options
                            className="z-1 bg-main bg-opacity-20 p-[10px] mt-[10px] rounded-md"
                        >
                            <Listbox.Option
                                value="FRONTEND"
                                className={"p-[5px] rounded-md mt-[5px]" + (filters.filter === "FRONTEND" ? " bg-main" : "bg-main bg-opacity-20 hover:bg-main hover:bg-opacity-30")}
                            >
                                Frontend
                            </Listbox.Option>

                            <Listbox.Option
                                value="BACKEND"
                                className={"p-[5px] rounded-md mt-[5px]" + (filters.filter === "BACKEND" ? " bg-main" : "bg-main bg-opacity-20 hover:bg-main hover:bg-opacity-30")}
                            >
                                Backend
                            </Listbox.Option>
                        </Listbox.Options>
                    </Listbox>
                </div>
                <button
                    className='button w-[15%] bg-warning hover:bg-warningdark m-0'
                    onClick={() => {
                        setFilters(initalFilter)
                    }}
                >
                    Clear Filters
                </button>
            </div>
            {
                shownServices ?
                    <div>
                        {
                            shownServices?.map((service, index) => {
                                return (
                                    <div key={index}>
                                        <ServiceChip service={service} setServices={setServices} setAlert={setAlert} />
                                    </div>
                                )
                            })
                        }
                        <Link className='button fc flex-row' to="/services/add" onClick={() => setUpdateSidebar(!updateSidebar)}>
                            <PlusIcon className='h-5 w-5' />
                            New Service
                        </Link>
                    </div>
                    :
                    <div className='my-[10px]'>
                        <LoadingWheel />
                    </div>
            }
        </div>
    )
}

export default Services