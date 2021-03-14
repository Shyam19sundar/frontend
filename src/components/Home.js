import axios from '../axios.js'
import React from 'react'
import { hasAccess, refresh } from './Access.js'
import Cookies from 'js-cookie'
import '../css/Home.css'

function Home({ setPath }) {
    // axios.post('/protected').then(res => console.log(res).catch(err => console.log(err)))
    setPath('/')
    const accessProtected = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await requestLogin(access, refreshToken);
        }
    };

    const requestLogin = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/protected",
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        console.log(response);
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            console.log("hello");
                            const access = await refresh(refreshToken);
                            return await requestLogin(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };
    return (
        <div className='home'>
            <div className='home-content'>
                <h2>We help you get connected !</h2>
                {/* <input type='text' placeholder='Search Rooms' /> */}
                <p>We help you find your replica. Do interact with them.</p>
                <p> Join us today !</p>
            </div>
            <div className='home-image'>
                <img src='./images/puzzle-pic2.png' />
            </div>

        </div>
    )
}

export default Home
