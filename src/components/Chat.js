import React, { lazy, Suspense } from 'react'
import ChatContent from './ChatContent'
import ChatList from './ChatList'
import '../css/Chat.css'
import Cookies from 'js-cookie'


function Chat() {

    const renderLoader = () => <p>Loading...</p>;
    return (
        <div className='chat'>
            {Cookies.get('refresh') ?
                <div className='chat'>
                    <ChatList />
                    <ChatContent />
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

export default Chat
