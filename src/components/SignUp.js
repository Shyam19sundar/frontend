import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../axios'
import '../css/Signup.css'
import $ from 'jquery'

function SignUp() {
    const [email, setEmail] = useState("")
    const history = useHistory()
    const notify = (message) => toast.error(message);

    const handleSubmit = () => {
        if ($('#signup-email').val() !== ('' && undefined)) {
            axios.post("/verify", {
                email: email,
            }).then(
                res => {
                    if (res.status === 200)
                        if (typeof Storage !== "undefined") {
                            // Store
                            sessionStorage.setItem("email", email);
                        }
                    history.push('/verify')
                }
            ).catch(err => {
                console.log(err.message)
                if (err.message === 'Request failed with status code 409')
                    notify('Already signed-up.Please login!')
                else
                    notify('Something went wrong.Please try again later!')
            })

        }
        else
            $("#email-bottom").css({ width: '100%', backgroundColor: 'red' })
    }
    return (
        <div className="signup">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={true} />
            <div className='signup-container'>
                <h2>Dovetail</h2>
                <p>Sign up to join us!</p>
                <div className='signupInput-container'>
                    <input type='email' placeholder='Email' id='signup-email' onChange={(e) => setEmail(e.target.value)} />
                    <span id='email-bottom'></span>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>

        </div>
    )
}

export default SignUp
