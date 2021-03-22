import React, { useEffect, useState } from 'react'
import SendIcon from '@material-ui/icons/Send';
import '../css/RoomMessages.css'
import axios from '../axios';
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'
import { useStateValue } from '../StateProvider';
import io from "socket.io-client";
import $ from 'jquery'
import ReactLoading from 'react-loading';

// const ENDPOINT = 'https://desolate-fortress-07828.herokuapp.com/';
const ENDPOINT = 'http://localhost:5000/';


function RoomMessages() {
    const [message, setmessage] = useState("")
    const [{ room, user, roomDetails, allMembers }, dispatch] = useStateValue()
    const [roomMessages, setRoomMessages] = useState([])
    const [roomMember, setroomMember] = useState(false)
    const [name, setname] = useState("")


    useEffect(() => {
        if (room) {
            setRoomMessages(null)
            $('.loading-icon-center').show()
            axios.post('/roomMessages', {
                roomName: room?.roomName
            }).then(
                res => {
                    $('.loading-icon-center').hide()
                    setRoomMessages(res.data)
                }
            )
        }
        if (room) {
            const socket = io(ENDPOINT);
            socket.on('users', (data) => {
                // $('.loading-icon-center').show()
                console.log(data)
                var arr = []
                data.map(message => {
                    if (message.roomId) {
                        if (message.roomId === room?._id)
                            arr.push(message)
                    }
                })
                if (arr.length !== 0) {
                    setRoomMessages(arr)
                    console.log(arr)
                }

                // $('.loading-icon-center').hide()
            })
        }
        if (roomDetails) {
            let isFound = roomDetails.findIndex(singleRoomDetail => (singleRoomDetail?.email === user?.email))
            if (isFound !== -1) {
                setroomMember(true)
            } else {
                setroomMember(false)
            }
        }

    }, [room, roomDetails])

    const getRoom = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    "/roomMessage",
                    {
                        room: room.roomName,
                        message: message,
                        name: user?.name
                    },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        // setResponse(response.data);
                        resolve(true);
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await getRoom(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };

    const accessRoom = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await getRoom(access, refreshToken);
        }
    };

    const handleSubmit = (e) => {
        console.log('once');
        $('.chatMessages-input input').val('')
        if (room) {
            var d = new Date();
            var date = d.toLocaleString()
            const obj = {
                fromEmail: user?.email,
                message: message,
                time: date,
                name: user?.name
            }
            setRoomMessages((prev) => prev ? [...prev, obj] : obj)
            accessRoom()
        }
    }

    const handleClick = () => {
        setroomMember(true)
        var arr = roomDetails
        arr.push(user)
        axios.post('/joinRoom', {
            email: user?.email,
            roomName: room.roomName,
        }).then(res =>
            dispatch({
                type: 'SET_ROOM_MEMBERS',
                roomDetails: arr
            }))
    }

    useEffect(() => {
        if (!roomMember)
            $('.chatMessages-input').hide()
        else
            $('.chatMessages-input').show()
    }, [roomMember])

    return (
        <div className='roomMessages'>
            <ReactLoading color='#180022' type='spinningBubbles' className='loading-icon-center' />
            <div className='chatMessages-header'>
                <h2>{room?.roomName} </h2>
            </div>
            {room ? roomMember ?
                // <div className='roomMessages-hide'>
                <div className='chatMessages-container room'>
                    {
                        roomMessages?.map(single => (
                            <div className={(single.fromEmail == user?.email) ? `chatMessages-message justifyRight room-name` : `chatMessages-message justifyLeft room-nameLeft`}>
                                <div className='chatMessages-sender'>
                                    <span>{single.name}</span>
                                </div>
                                <div>
                                    <span>{single.time}</span>
                                    <p>{single.message}</p>

                                </div>

                            </div>
                        ))
                    }
                </div>

                // </div>
                :
                <button className="join__room" onClick={handleClick}>
                    Join Room
                </button> : null
            }
            <div className='chatMessages-input'>
                <input onChange={(e) => setmessage(e.target.value)} required type='text' placeholder='Send a message' />
                <SendIcon id='sendIcon' onClick={handleSubmit} />
                <button type="submit" style={{ display: 'none' }} ></button>
            </div>


        </div>
    )
}

export default RoomMessages