import React, { useState, useEffect, lazy, Suspense } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import '../css/ChatList.css'
import axios from '../axios';
import ChatMessages from './ChatMessages';
import { useHistory, withRouter } from "react-router-dom";
import { useStateValue } from '../StateProvider'
import ReactLoading from 'react-loading';
import $ from 'jquery'


function ChatList() {
    const [{ receiver }, dispatch] = useStateValue()

    const [members, setmembers] = useState([])
    const [list, setList] = useState([])
    const [searches, setsearches] = useState([])
    useEffect(() => {
        axios.get('/allMembers').then(res => {
            setList(res.data)
            setmembers(res.data)
            $('.loading-icon').hide()
        }
        )
    }, [])
    const handleChange = (e) => {
        if (e.target.value !== ('' && null))
            setsearches(members?.filter(member => member?.name?.includes(e.target.value)))
        else setsearches([])
    }
    const handleClick = (search) => {

        dispatch({
            type: 'SET_CHAT_RECEIVER',
            receiver: search
        })
    }


    return (

        <div className='chatList'>
            <div className='chatList-search'>
                <input type='text' placeholder='Search' onChange={(e) => handleChange(e)} />
                <SearchIcon id='searchIcon' />
            </div>
            <div className='chatList-scroll'>
                <ReactLoading color='#180022' type='spinningBubbles' className='loading-icon' />
                {
                    searches?.map(search => (
                        <div onClick={() => handleClick(search)} className='chatList-searchList searches'>
                            {search?.dp ? <img src={search?.dp} /> : <img src='../images/male.png' />}
                            <div>
                                <h4>{search.name}</h4>
                                <p>Hello! Good Morning</p>
                            </div>
                        </div>
                    ))
                }
                {
                    list?.map(single => (
                        <div onClick={() => handleClick(single)} className='chatList-searchList'>
                            {single?.dp ? <img src={single?.dp} /> : <img src='../images/male.png' />}
                            <div>
                                <h4>{single.name}</h4>
                                <p>Hello! Good Morning</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

// export default withRouter(ChatList)
export default ChatList
