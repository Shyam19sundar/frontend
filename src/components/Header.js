import React, { useState, useEffect } from 'react'
import '../css/Header.css'
import $ from 'jquery'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../axios';
import { useStateValue } from '../StateProvider';

function Header() {
    const [{ user }, dispatch] = useStateValue()

    return (
        <div className='header'>
            <h1>DOVETAIL</h1>
            <div>
                {Cookies.get('refresh') ?
                    <div className="header__details">
                        <div>
                            <h3>Hello</h3>
                            <h2>{user?.name}</h2>
                        </div>
                        <div>
                            {user?.dp ?
                                <div>
                                    <img src={user?.dp} />
                                </div> :
                                <div>
                                    <img src="../images/male.png" />
                                </div>}
                        </div>
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

