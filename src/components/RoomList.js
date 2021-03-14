import React, { useState, useEffect } from 'react'
import "../css/RoomList.css"
import $ from 'jquery'
import io from "socket.io-client";
import axios from '../axios'
import { useHistory, withRouter } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import Cookies from 'js-cookie'
import { hasAccess, refresh } from './Access.js'
import { useStateValue } from '../StateProvider';
import ReactLoading from 'react-loading';

const ENDPOINT = 'http://localhost:5000';

let socket;

function RoomList() {
    const history = useHistory();
    const [response, setResponse] = useState([])
    const [{ room }, dispatch] = useStateValue()
    const [roomName, setroomName] = useState("")
    const [roomResponse, setroomResponse] = useState(null)
    const [searches, setsearches] = useState([])

    const handleClick = () => {
        $('.add-room-form').toggle({ display: 'flex' })
    }
    const handleChange = (e) => {
        if (e.target.value !== ('' && null))
            setsearches(response?.filter(room => room?.roomName?.includes(e.target.value)))
        else setsearches([])
    }
    const addNewRoom = async (access, refreshToken) => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    '/newroom', {
                    roomName: roomName
                },
                    {
                        headers: {
                            authorization: `Bearer ${access}`,
                        },
                    }
                )
                .then(
                    (response) => {
                        console.log(response.data)
                        setResponse(response.data);
                        resolve(true);
                        $('.loading-icon').hide()
                    },
                    async (error) => {
                        if (error.response.status === 401)
                            console.log("You are not authorized!");
                        else if (error.response.status === 498) {
                            const access = await refresh(refreshToken);
                            return await addNewRoom(access, refreshToken);
                        }
                        resolve(false);
                    }
                );
        });
    };


    const accessAddRoom = async () => {
        let accessToken = Cookies.get("access");
        let refreshToken = Cookies.get("refresh");
        const access = await hasAccess(accessToken, refreshToken);
        if (!access) {
            console.log("You are not authorized");
        } else {
            await addNewRoom(access, refreshToken);
        }
    };

    const addRoom = (e) => {
        e.preventDefault()
        accessAddRoom()
        $('.loading-icon').show()
    }
    useEffect(() => {
        // socket = io(ENDPOINT);
        axios.get('/roomList').then(res => {
            setResponse(res.data)
            $('.loading-icon').hide()
        })
    }, [ENDPOINT])

    const handleRoom = (room) => {
        dispatch({
            type: 'SET_ROOM',
            room: room
        })
        axios.post('/roomMembers', { roomName: room.roomName })
            .then(res =>
                dispatch({
                    type: 'SET_ROOM_MEMBERS',
                    roomDetails: res.data
                }))
    }

    return (
        <div className="room-list">
            <div className='add-room-container'>
                <button onClick={handleClick}>Create a new Room</button>
                <form className="add-room-form" onSubmit={addRoom}>
                    {/* <div>Room Name</div> */}
                    <input placeholder="Room Name" onChange={(e) => setroomName(e.target.value)} />
                    <button type="submit">Add</button>
                </form>

            </div>


            <div className='chatList-search'>
                <input type='text' placeholder='Search' onChange={(e) => handleChange(e)} />
                <SearchIcon id='searchIcon' />
            </div>
            <div className='chatList-scroll'>
                <ReactLoading color='#180022' type='spinningBubbles' className='loading-icon' />
                {
                    searches?.map(room => (
                        <div onClick={() => handleClick(room)} className='chatList-searchList searches room-searches'>
                            <div>
                                <h4>{room.roomName}</h4>
                            </div>
                        </div>
                    ))
                }
                {
                    response?.map(room => (
                        <div onClick={() => handleRoom(room)} className='chatList-searchList room-searches'>
                            <div>
                                <h4>{room.roomName}</h4>
                            </div>
                        </div>
                    ))
                }
            </div>


        </div>
    )
}

export default withRouter(RoomList)