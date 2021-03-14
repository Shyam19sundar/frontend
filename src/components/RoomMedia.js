import React from 'react'
import '../css/RoomMedia.css'
import { useStateValue } from '../StateProvider'

function RoomMedia() {
    const [{ roomDetails }, dispatch] = useStateValue()

    return (
        <div className='roomMedia'>
            <h2>Members</h2>
            {roomDetails ?
                roomDetails?.map(member => (
                    <div className='chatList-searchList'>
                        {member?.dp ? <img src={member?.dp} /> : <img src='../images/male.png' />}
                        <h4>{member.name}</h4>
                    </div>
                ))
                :
                <p></p>}

            {/* <span>{room.time}</span> */}
        </div>
    )
}

export default RoomMedia
