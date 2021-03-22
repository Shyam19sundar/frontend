import axios from '../axios'
import React, { useState } from 'react'
import "../css/Login.css"
import $ from 'jquery'
import { Link, useHistory } from 'react-router-dom'
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';

function Login({ setPath }) {
    setPath('/login')
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmit = () => {
        if ((email && password) !== ('' && undefined)) {
            axios.post("/login", {
                email: email,
                password: password
            }).then(data => {
                Cookies.set("access", data.data.access, { sameSite: 'None', secure: true });
                Cookies.set("refresh", data.data.refresh, { expires: 7, sameSite: 'None', secure: true });
                history.push('/')
                setPath('/')
            }).catch(err => {
                if (err.response.status === 401)
                    notify(err.response.data.message)
                else
                    notify('Something went wrong :/')
            }
            )
        }
        else {
            if (password === '' || null)
                $('#password-bottom').css({ backgroundColor: 'red', width: '100%' })
            if (email === '' || null)
                $('#loginEmail-bottom').css({ backgroundColor: 'red', width: '100%' })
        }

    }

    const notify = (message) => toast.error(message);

    return (
        <div className="login">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={true} />
            <div className='login-container'>
                <h1>Dovetail</h1>
                <p>Login to your account!</p>
                <div className='loginInput-container'>
                    <input type='email' placeholder='Email' id='login-email' onChange={(e) => setEmail(e.target.value)} />
                    <span id='loginEmail-bottom'></span>
                </div>
                <div className='loginInput-container'>
                    <input type='password' placeholder='Password' id='login-password' onChange={(e) => setPassword(e.target.value)} />
                    <span id='password-bottom'></span>
                </div>
                <button onClick={handleSubmit}>Submit</button>
                <Link to='/signup'>
                    Not having an account? Sign-up here !
                </Link>
            </div>
        </div>
    )
}

export default Login
