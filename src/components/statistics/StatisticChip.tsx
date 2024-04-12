//import React from 'react'
import { Link } from "react-router-dom"
import { overrideLinks } from "../routes/Statistics"
import { ArrowRightIcon } from "@heroicons/react/20/solid"
import { useUser } from "../../App"

interface StatisticChipProp {
    name: string,
    value: number,
    side?: "LEFT" | "RIGHT"
}

const Inner = ({ name, value }: StatisticChipProp) => {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-[95%] fc flex-row">
                <div className="w-1/2 flex justify-end mr-[3px] text-4xl text-main group-hover:text-white">
                    {value}
                </div>
                <div className="w-1/2 flex ml-[3px] items-end h-10 text-2xl text-main group-hover:text-white">
                    {name[0].toUpperCase() + name.slice(1).toLowerCase()}
                </div>
            </div>
            {
                Object.keys(overrideLinks).includes(name) &&
                <ArrowRightIcon className="h-[24px] w-[24px] group-hover:h-[32px] group-hover:w-[32px] self-end mr-[20px] my-[4px] group-hover:mr-[16px] group-hover:my-[0px] group-hover:transition-all" />
            }
        </div>
    )
}

const StatisticChip = ({ name, value, side }: StatisticChipProp) => {

    const { updateSidebar, setUpdateSidebar } = useUser()

    return (
        <div className={"group w-[calc(50%-5px)] h-[300px] bg-bgdark hover:bg-main mb-[10px] p-[10px] rounded-md " + (side === "RIGHT" ? "ml-[5px] " : "mr-[5px] ") + (Object.keys(overrideLinks).includes(name) ? "cursor-pointer" : "cursor-auto")}>
            {
                Object.keys(overrideLinks).includes(name) ?
                    <Link className="h-full w-full block" to={overrideLinks[name]!} onClick={() => setUpdateSidebar(!updateSidebar)}>
                        <Inner name={name} value={value} />
                    </Link>
                    :
                    <div className="h-full w-full">
                        <Inner name={name} value={value} />
                    </div>
            }
        </div>
    )
}

export default StatisticChip