import React, { useState, useEffect } from 'react'
import '../css/Header.css'
import $ from 'jquery'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../axios';
import { useStateValue } from '../StateProvider';
import { hasAccess, refresh } from './Access.js'

function Header() {
    const [{ user }, dispatch] = useStateValue()

    const accessProtected = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await getMe(access, refreshToken);
        }
    };

    const getMe = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/getMe",
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        dispatch({
                            type: 'SET_USER',
                            user: response.data
                        })
                        resolve(true);
                    },
                    async (error) => {
                        if (error) {
                            if (error.response.status === 401)
                                console.log("You are not authorized!");
                            else if (error.response.status === 498) {
                                const access = await refresh(refreshToken);
                                return await getMe(access, refreshToken);
                            }
                            resolve(false);
                        }

                    }
                );
        });
    };
    useEffect(() => {
        if (Cookies.get("refresh")) {
            if (!user) {
                accessProtected()
                console.log('change')
            }
        }

    }, [user])

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

