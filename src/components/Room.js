import React from 'react'
import '../css/Chat.css'
import RoomList from './RoomList'
import RoomContent from './RoomContent'
import Cookies from 'js-cookie'


function Room() {
    return (
        <div className='chat'>
            {Cookies.get('refresh') ?
                <div className='chat'>
                    <RoomList />
                    <RoomContent />
                </div>
                :
                <div className='anonymous'>
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

export default Room
