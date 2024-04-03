//import React from 'react'
import { Switch } from '@headlessui/react'
import { ShallowServiceData } from '../../global/types'

interface ServiceChipProps {
    service: ShallowServiceData,
    setServices: React.Dispatch<React.SetStateAction<ShallowServiceData[] | undefined>>
}

const ServiceChip = ({ service, setServices }: ServiceChipProps) => {

    const toggleService = () => {
        setServices((prevServices) => (prevServices?.map((prevService: ShallowServiceData) => {
            if (service.id === prevService.id) {
                return {
                    ...prevService, enabled: !prevService.enabled
                }
            } else {
                return prevService
            }
        })))
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
                This service &nbsp;<div className={service.togglable ? "text-white" : "text-error"}>{service.togglable ? "is" : "isn't"}</div>&nbsp; togglable.
            </div>
            <div className='flex flex-row my-[10px] opacity-50'>
                <div className='mr-[20px]'>
                    {service.enabled ? "Disable this service" : "Enable this service"}
                </div>
                <Switch
                    checked={service.enabled}
                    disabled={!service.togglable}
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