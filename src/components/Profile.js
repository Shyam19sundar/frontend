import React, { useState } from 'react'
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import "../css/Profile.css"
import $ from "jquery"
import axios from '../axios';
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'
import Model from './Model';
import { useStateValue } from '../StateProvider';

function Profile() {

    const [{ uploaded, user }, dispatch] = useStateValue()
    const [interests, setinterests] = useState("")
    const [nameChange, setnameChange] = useState(false)
    const [name, setname] = useState("")
    const handleAreas = () => {
        $('.addAreas-container').toggle({ display: 'block' })
    }

    const handleName = () => {
        setnameChange(true)
    }
    const updateName = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/updateName",
                    {
                        name: name
                    },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        if (response.data) {
                            dispatch({
                                type: 'SET_USER',
                                user: response.data
                            })
                            setnameChange(false)
                        }
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await updateName(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };

    const accessName = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await updateName(access, refreshToken);
        }
    };

    const updateInterst = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/updateInterst",
                    {
                        interests: interests
                    },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        if (response.data) {
                            dispatch({
                                type: 'SET_USER',
                                user: response.data
                            })
                            setnameChange(false)
                        }
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await updateInterst(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };

    const accessInterest = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await updateInterst(access, refreshToken);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        accessName()
    }

    const handleInterests = e => {
        $('.addAreas-input').val('')
        e.preventDefault()
        accessInterest()
    }

    return (
        <div>
            <Model show={uploaded} />
            {
                Cookies.get('refresh') ?
                    <div className="profile">
                        <div className="profile-image">
                            {user?.dp ?
                                <div>
                                    <img src={user?.dp} />
                                    <EditIcon onClick={() => {
                                        dispatch({
                                            type: 'SET_UPLOAD',
                                            uploaded: true
                                        })
                                    }} className="dp-edit" />
                                </div> :
                                <div>
                                    <img src="../images/male.png" />
                                    <EditIcon onClick={() => {
                                        dispatch({
                                            type: 'SET_UPLOAD',
                                            uploaded: true
                                        })
                                    }} className="dp-edit" />
                                </div>}

                        </div>
                        <div className='profile-name'>
                            {nameChange ?
                                <div className='addName-container'>
                                    <form onSubmit={handleSubmit}>
                                        <input type='text' className='addName' onChange={(e) => setname(e.target.value)} placeholder='Update Name' />
                                        <SendIcon type="submit" onClick={handleSubmit} className='name-update' />
                                    </form>
                                </div>
                                :
                                <div>
                                    <h2>{user?.name}</h2>
                                    <EditIcon className="name-edit" onClick={handleName} />
                                </div>
                            }
                        </div>
                        <div className='profile-areas'>
                            <div className='areas-head'>
                                <h2>What I love</h2>
                                <AddIcon className='add-icon' onClick={handleAreas} />
                                <div className='addAreas-container'>
                                    <form onSubmit={handleInterests}>
                                        <input type='text' onChange={(e) => setinterests(e.target.value)} className='addAreas-input' placeholder='Add an area' />
                                        <SendIcon onClick={handleInterests} type="submit" className='areas-send' />
                                    </form>
                                </div>

                            </div>
                            <div>
                                {user?.interests ? user.interests.map(interest => <p>{interest}</p>) : <h3>Update What You Love</h3>}
                            </div>
                        </div>
                    </div> :
                    <div className='anonymous-profile'>
                        <img src='../images/anonymous.jpg' />
                        <div>
                            <p>You're not logged in :/</p>
                            <p> Login to catch your personalized contents !</p>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Profile
