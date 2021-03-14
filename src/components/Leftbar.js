import React, { useState, useEffect } from 'react'
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ChatIcon from '@material-ui/icons/Chat';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import '../css/Leftbar.css'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import $ from "jquery"

function Leftbar() {
    const [path, setPath] = useState(window.location.pathname)
    useEffect(() => {
        if (path === "/login")
            $('.leftBar').hide()
    }, [])

    const handleLogout = () => {
        Cookies.remove('access');
        Cookies.remove('refresh');
        setPath('/')
    }
    return (
        <div className='leftBar'>
            <div>
                <div className={path === '/' ? 'leftBar-icon leftBar-active' : 'leftBar-icon'}>
                    <Link to="/" onClick={() => setPath('/')} setPath={setPath}>
                        <HomeIcon />
                        <p>Home</p>
                    </Link>
                </div>
                <div className={path === '/profile' ? 'leftBar-icon leftBar-active' : 'leftBar-icon'}>
                    <Link to='/profile' onClick={() => setPath('/profile')}>
                        <PersonIcon />
                        <p>Profile</p>
                    </Link>

                </div>
                <div className={path === '/chats' ? 'leftBar-icon leftBar-active' : 'leftBar-icon'}>
                    <Link to='/chats' onClick={() => setPath('/chats')}>
                        <ChatIcon />
                        <p>Chats</p>
                    </Link>

                </div>
                <div className={path === '/rooms' ? 'leftBar-icon leftBar-active' : 'leftBar-icon'}>
                    <Link to='/rooms' onClick={() => setPath('/rooms')}>
                        <MeetingRoomIcon />
                        <p>Rooms</p>
                    </Link>
                </div>
                {
                    Cookies.get('refresh') ?
                        <div className='leftBar-icon'>
                            <Link to='/'>
                                <div onClick={handleLogout}>
                                    <ExitToAppIcon />
                                    <p>Logout</p>
                                </div>
                            </Link>
                        </div>
                        :
                        null
                }
            </div>
        </div>
    )
}

export default Leftbar
