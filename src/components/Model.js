import React, { useState, useEffect } from 'react'
import "../css/Model.css"
import { storage } from "../firebase"
import axios from '../axios';
import { useStateValue } from '../StateProvider'
import $ from 'jquery'

function Model(props) {
    const [image, setImage] = useState(null)
    const [{ uploaded, user }, dispatch] = useStateValue()

    const handleChange = e => {
        if (e.target.files[0]) {
            var temp = e.target.files[0]
            setImage(temp)
        }
    }

    useEffect(() => {
        console.log(props.show)
        if (props.show)
            $('.modal').show()
        else
            $('.modal').hide()

    }, [props])

    const handleSubmit = e => {
        e.preventDefault()
        const date = Date.now()
        const uploadTask = storage.ref(`images/${image.name}_${date}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progressCurrent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
            },
            error => {
                console.log(error);
            },
            () => {
                var userTemp = user
                storage
                    .ref("images")
                    .child(`${image.name}_${date}`)
                    .getDownloadURL()
                    .then(url => {
                        userTemp.dp = url
                        dispatch({
                            type: 'SET_USER',
                            user: userTemp
                        })
                        axios.post("/updatedDp", {
                            user: user?.email,
                            dp: url
                        }).then(res => {
                            if (res.data === 'Done') {
                                dispatch({
                                    type: 'SET_UPLOAD',
                                    uploaded: false
                                })
                            }
                        })
                            .catch(err => console.log(err))
                    });
            }
        )
    }

    return (

        <div id="myModal" className="modal">

            <div className="modal-content">
                <div>
                    <input type="file" onChange={handleChange} />
                </div>
                <div>
                    {image ? <img src={window.URL.createObjectURL(image)} roundedCircle />
                        :
                        <img src="profile.png" roundedCircle />}
                </div>
                <button onClick={handleSubmit}>Upload</button>
                <h5 onClick={() => {
                    dispatch({
                        type: 'SET_UPLOAD',
                        uploaded: false
                    })
                }}>Close</h5>
            </div>
        </div>
    )
}

export default Model
