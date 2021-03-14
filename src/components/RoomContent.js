import React from 'react'
import RoomMedia from './RoomMedia'
import RoomMessages from './RoomMessages'
import '../css/RoomContent.css'

function RoomContent() {
    return (
        <div className='roomContent'>
            <RoomMessages />
            <RoomMedia />
        </div>
    )
}

export default RoomContent
