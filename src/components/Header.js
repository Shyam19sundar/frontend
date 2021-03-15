import React, { useState, useEffect } from 'react'
import '../css/Header.css'
import $ from 'jquery'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../axios';

function Header() {
    const [signedin, setSignedin] = useState(false)
    const [name, setname] = useState("")
    const user = sessionStorage.getItem("user");

    useEffect(() => {
        if (user)
            axios.get('/getMyName', {
                params: {
                    email: user
                }
            }).then(res => setname(res.data))
    }, [])

    return (
        <div className='header'>
            <h1>DOVETAIL</h1>
            <div>
                {Cookies.get('refresh') ?
                    <div>
                        <h3>Hello</h3>
                        <h2>{name}</h2>
                    </div>

                    :
                    <Link to='/login'>
                        <button>Sign-in</button>
                    </Link>
                }
            </div>

        </div >
    )
}

export default Header

