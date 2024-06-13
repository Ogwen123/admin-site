import React from 'react'
import { url } from '../../utils/url'
import Alert from '../Alert'
import { _Alert } from '../../global/types'
import LoadingWheel from '../LoadingWheel'

const Login = () => {

    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const [submitting, setSubmitting] = React.useState<boolean>(false)
    const [alert, setAlert] = React.useState<_Alert>(["Alert", "ERROR", false])

    const login = () => {
        setSubmitting(true)
        fetch(url("auth") + "login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: username,
                password,
                service: "ADMIN",
                min_flag: 3
            })
        }).then((res) => {
            if (!res.ok) {
                res.json().then((data) => {
                    setAlert([data.error instanceof Array ? data.error[0] : data.error, "ERROR", true])
                    setSubmitting(false)
                })
            } else {
                res.json().then((data) => {
                    setAlert(["Successfully logged in", "SUCCESS", true])
                    setSubmitting(false)
                    localStorage.setItem("token", data.data.token)
                    setTimeout(() => {
                        location.href = "/"
                    }, 500)
                })
            }
        }).catch(() => {
            setAlert(["An unknown error occured whilst logging in.", "ERROR", true])
            setSubmitting(false)
        })
    }

    return (
        <div className='fc page-parent flex-col'>
            <Alert
                content={alert[0] instanceof Array ? alert[0][1] : alert[0]}
                severity={alert[1]}
                show={alert[2]}
                title={alert[0] instanceof Array ? alert[0][0] : undefined}
                width="40%"
            />
            <div className='my-[20px] text-xl'>
                Login to the admin dashboard
            </div>
            <div className='w-1/5 mb-[70px] relative cursor-pointer'>{/* bottom margin is to raise the form up a bit */}
                <form onSubmit={(e) => {
                    e.preventDefault()
                    login()
                }}>
                    <input
                        className='form-input'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                    ></input>
                    <input
                        className='form-input'
                        placeholder='Password'
                        type='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    ></input>
                    <button type="submit" className='button h-[44px]' onClick={(e) => {
                        e.preventDefault()
                        login()
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
        </div>
    )
}

export default Login