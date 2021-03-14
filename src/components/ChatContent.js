import React from 'react'
import '../css/ChatContent.css'
import ChatMedia from './ChatMedia'
import ChatMessages from './ChatMessages'

function ChatContent() {
    return (
        <div className='chatContent'>
            <ChatMessages />
            <ChatMedia />
        </div>
    )
}

export default ChatContent
