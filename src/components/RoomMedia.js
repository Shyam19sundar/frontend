import React, { useEffect } from 'react'
import '../css/RoomMedia.css'
import { useStateValue } from '../StateProvider'
import $ from 'jquery'
import axios from '../axios'
import ReactLoading from 'react-loading';

function RoomMedia() {
    const [{ room, roomDetails }, dispatch] = useStateValue()
    useEffect(() => {
        if (room) {
            $('.roomMedia-container').hide()
            $('.loading-icon-media').show()
            axios.post('/roomMembers', { roomName: room?.roomName })
                .then(res => {
                    $('.loading-icon-media').hide()
                    dispatch({
                        type: 'SET_ROOM_MEMBERS',
                        roomDetails: res.data
                    })
                    $('.roomMedia-container').show()
                })
        }
    }, [room])
    return (
        <div className='roomMedia'>
            <ReactLoading color='#180022' type='spinningBubbles' className='loading-icon-media' />
            <h2>Members</h2>
            <div className='roomMedia-container'>
                {roomDetails ?
                    roomDetails?.map(member => (
                        <div className='chatList-searchList'>
                            {member?.dp ? <img src={member?.dp} /> : <img src='../images/male.png' />}
                            <h4>{member.name}</h4>
                        </div>
                    ))
                    :
                    <p></p>}
            </div>

        </div>
    )
}

export default RoomMedia
