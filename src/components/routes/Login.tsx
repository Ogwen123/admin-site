import React from 'react'

const Login = () => {

    const [username, setUsername] = React.useState<string>()
    const [password, setPassword] = React.useState<string>()

    return (
        <div className='fc page-parent flex-col'>
            <div className='my-[20px] text-xl'>
                Login to the admin dashboard
            </div>
            <div className='w-1/5 mb-[70px]'>{/* bottom margin is to raise the form up a bit */}
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
                <button className='button'>Submit</button>
            </div>
        </div>
    )
}

export default Login