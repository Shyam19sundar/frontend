import axios from '../axios'
import React, { useEffect, useState } from 'react'
import '../css/ChatMedia.css'
import { useStateValue } from '../StateProvider'
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import ReactLoading from 'react-loading';
import $ from 'jquery'

function ChatMedia() {
    const [{ receiver }, dispatch] = useStateValue()
    const [details, setdetails] = useState(null)
    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        large: {
            width: theme.spacing(20),
            height: theme.spacing(20),
        },
    }));
    const classes = useStyles();
    useEffect(() => {
        if (receiver) {
            setdetails([])
            $('.loading-icon-chat-media').show()
            axios.get('/getDetails', {
                params: {
                    email: receiver?.email
                }
            }).then(res => {
                $('.loading-icon-chat-media').hide()
                setdetails(res.data)
            })
        }
    }, [receiver])

    return (
        <div className='chatMedia'>
            <ReactLoading color='#180022' type='spinningBubbles' className='loading-icon-chat-media' />
            {details ?
                <div className="details">
                    <div className={classes.root}>
                        <img className={classes.large} src={details.dp} />
                    </div>
                    <h3>{details?.name}</h3>
                    <h5>Interests :</h5>
                    {details?.interests?.length !== 0 ? details?.interests?.map(interest => <div>{interest}</div>) : <div>No Interests</div>}
                </div>
                :
                <h3>Details</h3>
            }
        </div>
    )
}

export default ChatMedia
