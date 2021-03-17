import React, { useState, useEffect } from 'react'
import SendIcon from '@material-ui/icons/Send';
import '../css/ChatMessages.css'
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'
import axios from '../axios';
import { useStateValue } from '../StateProvider';
import io from "socket.io-client";
import $ from 'jquery'
import ReactLoading from 'react-loading';

// const ENDPOINT = 'https://desolate-fortress-07828.herokuapp.com/';
const ENDPOINT = 'http://localhost:5000/';




function ChatMessages() {
    const [{ receiver, user }, dispatch] = useStateValue()
    const [response, setresponse] = useState(null)
    const [message, setmessage] = useState("")

    const directMessage = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/directMessage",
                    { receiver: receiver.email },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        $('.loading-icon-chat-center').hide()
                        if (response.data !== 'No Messages')
                            setresponse(response.data);
                        console.log(response.data)
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await directMessage(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };

    const addMessage = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/addMessage",
                    {
                        toEmail: receiver.email,
                        message: message
                    },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await addMessage(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };

    const accessDirect = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await directMessage(access, refreshToken);
        }
    };

    const accessAdd = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await addMessage(access, refreshToken);
        }
    };

    useEffect(() => {
        setresponse([])
        if (receiver) {
            $('.loading-icon-chat-center').show()
            accessDirect()
            const socket = io(ENDPOINT);
            socket.on('users', (data) => {
                console.log(data)
                var arr = []
                data.map(message => {
                    if (user && receiver && receiver?.email)
                        if ((message.fromEmail === user.email || message.fromEmail === receiver.email) && (message.toEmail === user.email || message.toEmail === receiver.email))
                            arr.push(message)
                })
                // $('.loading-icon-chat-center').hide()
                if (arr.length !== 0)
                    setresponse(arr)
            })
        }
    }, [ENDPOINT, receiver])



    const handleSubmit = (e) => {
        $('.chatMessages-input input').val('')
        if (receiver) {
            var d = new Date();
            var date = d.toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })
            const obj = {
                fromEmail: user.email,
                message: message,
                time: date
            }
            setresponse((prev) => prev ? [...prev, obj] : obj)
            accessAdd()
        }
    }

    return (
        <div className='chatMessages'>
            <ReactLoading color='#180022' type='spinningBubbles' className='loading-icon-chat-center' />
            <div className='chatMessages-header'>
                {receiver?.dp ? <img src={receiver?.dp} /> : <img src='../images/male.png' />}
                <h2>{receiver?.name}</h2>
            </div>
            <div className='chatMessages-container'>
                {
                    response?.map(single => (
                        <div className={single.fromEmail === user?.email ? `chatMessages-message justifyRight` : `chatMessages-message justifyLeft`}>
                            <p>{single.message}</p>
                            <span>{single.time}</span>
                        </div>
                    ))
                }
            </div>
            <div className='chatMessages-input'>
                <input onChange={(e) => setmessage(e.target.value)} required type='text' placeholder='Send a message' />
                <SendIcon id='sendIcon' onClick={handleSubmit} />
            </div>
        </div>
    )
}

export default ChatMessages
