//import React from 'react'
import { Switch } from '@headlessui/react'
import { _Alert, AppOutletContext, ServiceData } from '../../global/types'
import { url } from '../../utils/url'
import { useOutletContext } from 'react-router-dom'
import { alertReset } from '../Alert'

interface ServiceChipProps {
    service: ServiceData,
    setServices: React.Dispatch<React.SetStateAction<ServiceData[] | undefined>>,
    setAlert: React.Dispatch<React.SetStateAction<_Alert>>
}

const ServiceChip = ({ service, setServices, setAlert }: ServiceChipProps) => {

    const { user } = useOutletContext<AppOutletContext>()

    const flipToggle = (to?: boolean) => {
        setServices((prevServices) => (prevServices?.map((prevService: ServiceData) => {
            if (service.id === prevService.id) {
                return {
                    ...prevService, enabled: (to !== undefined ? to : !prevService.enabled)
                }
            } else {
                return prevService
            }
        })))
    }

    const toggleService = () => {
        flipToggle()

        fetch(url("admin") + "services/toggle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            },
            body: JSON.stringify({
                id: service.id
            })
        }).then((res) => {
            if (!res.ok) {
                res.json().then((data) => {
                    setAlert([data.error instanceof Array ? data.error[0] : data.error, "ERROR", true])
                    setTimeout(() => {
                        setAlert(alertReset)
                    }, 5000)
                    flipToggle()
                })
            } else {
                res.json().then((data) => {
                    setAlert(["Successfully toggled site.", "SUCCESS", true])
                    setTimeout(() => {
                        setAlert(alertReset)
                    }, 5000)
                    flipToggle(data.data.enabled)
                })
            }
        }).catch(() => {
            setAlert(["An unknown error occured whilst adding service.", "ERROR", true])
            flipToggle()
        })
        // update toggle
        // send request
        // if fails set toggle back and show alert
        // if succeeds update toggle with data from res
    }

    return (
        <div
            className='bg-bgdark p-[10px] my-[10px] rounded-md'
        >
            <div className='text-xl'>
                {service.alias}
            </div>
            <div className='text-xs text-hr'>
                {service.id}
            </div>
            <div className='flex flex-row mb-[10px]'>
                This service is a &nbsp;
                <div className={service.type === "BACKEND" ? "text-main" : "text-secondary"}>
                    {service.type}
                </div>
            </div>
            <div className='flex flex-row mb-[10px]'>
                This service &nbsp;<div className={service.toggleable ? "text-white" : "text-error"}>{service.toggleable ? "is" : "isn't"}</div>&nbsp; toggleable.
            </div>
            <div className={'flex flex-row my-[10px] ' + (service.toggleable ? "" : "opacity-50")}>
                <div className='mr-[20px]'>
                    {service.enabled ? "Disable this service" : "Enable this service"}
                </div>
                <Switch
                    checked={service.enabled}
                    disabled={!service.toggleable}
                    onChange={() => {
                        toggleService()
                    }}
                    className={`${service.enabled ? 'bg-main' : 'bg-error'} relative inline-flex h-[28px] w-[56px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                >
                    <span className="sr-only">Toggle Service</span>
                    <span
                        aria-hidden="true"
                        className={`${service.enabled ? 'translate-x-[28px]' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                </Switch>
            </div>
        </div >
    )
}

export default ServiceChip