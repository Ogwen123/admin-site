import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import React from 'react'
import LoadingWheel from '../LoadingWheel'
import { url } from '../../utils/url'
import { useUser } from '../../App'
import Alert from '../Alert'
import { _Alert } from '../../global/types'

// name, alias, type, togglable

const AddService = () => {

    const { user } = useUser()
    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    const [name, setName] = React.useState<string>("")
    const [alias, setAlias] = React.useState<string>("")
    const [type, setType] = React.useState<"BACKEND" | "FRONTEND">()
    const [toggleable, setToggleable] = React.useState<boolean>(true)

    const [submitting, setSubmitting] = React.useState<boolean>(false)

    const submit = () => {
        setSubmitting(true)

        fetch(url("admin") + "services/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            },
            body: JSON.stringify({
                name,
                alias,
                type,
                toggleable
            })
        }).then((res) => {
            if (!res.ok) {
                res.json().then((data) => {
                    setAlert([data.error instanceof Array ? data.error[0] : data.error, "ERROR", true])
                    setSubmitting(false)
                })
            } else {
                res.json().then(() => {
                    setAlert(["Successfully saved table.", "SUCCESS", true])
                    setSubmitting(false)
                    setTimeout(() => {
                        location.href = "/services"
                    }, 500)
                })
            }
        }).catch(() => {
            setAlert(["An unknown error occured whilst adding service.", "ERROR", true])
            setSubmitting(false)
        })
    }

    return (
        <div>
            <Alert content={alert[0] instanceof Array ? alert[0][1] : alert[0]} severity={alert[1]} show={alert[2]} title={alert[0] instanceof Array ? alert[0][0] : undefined} />
            <form>
                <input
                    placeholder='Name'
                    className='form-input'
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />
                <input
                    placeholder='Alias'
                    className='form-input'
                    value={alias}
                    onChange={(e) => {
                        setAlias(e.target.value)
                    }}
                />
                <div className='flex flex-row justify-start my-[5px]'>
                    <div className='flex flex-col w-1/2'>
                        <Listbox
                            value={type}
                            onChange={(data) => {
                                setType(data)
                            }}
                        >
                            <Listbox.Button
                                className="w-full bg-bgdark h-[49px] rounded-md fc flex-row"
                            >
                                {type ? type[0] + type.slice(1).toLowerCase() : "Type"}
                                <ChevronDownIcon
                                    className='h-5 w-5'
                                />
                            </Listbox.Button>
                            <Listbox.Options
                                className="z-1 bg-main bg-opacity-20 p-[10px] mt-[10px] rounded-md"
                            >
                                <Listbox.Option
                                    value="FRONTEND"
                                    className={"p-[5px] rounded-md mt-[5px]" + (type === "FRONTEND" ? " bg-main" : "bg-main bg-opacity-20 hover:bg-main hover:bg-opacity-30")}
                                >
                                    Frontend
                                </Listbox.Option>

                                <Listbox.Option
                                    value="BACKEND"
                                    className={"p-[5px] rounded-md mt-[5px]" + (type === "BACKEND" ? " bg-main" : "bg-main bg-opacity-20 hover:bg-main hover:bg-opacity-30")}
                                >
                                    Backend
                                </Listbox.Option>
                            </Listbox.Options>
                        </Listbox>
                    </div>
                    <div className='fc flex-row w-1/2 h-[49px]'>
                        <div className='mr-[20px]'>
                            Toggleable
                        </div>
                        <input
                            type='checkbox'
                            className='accent-main h-[15px] w-[15px]'
                            checked={toggleable}
                            onChange={(e) => {
                                setToggleable(e.target.checked)
                            }}
                        />
                    </div>
                </div>
                <button type="submit" className='button h-[44px]' onClick={(e) => {
                    e.preventDefault()
                    submit()
                }}>
                    {
                        submitting ?
                            <LoadingWheel size={24} />
                            :
                            <div>Submit</div>
                    }
                </button>
            </form>
        </div>
    )
}

export default AddService