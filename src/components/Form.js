import React, { useState } from "react";
import axios from "../axios.js";
import Cookies from "js-cookie";
import { hasAccess, refresh } from "./Access";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import $ from 'jquery'
import '../css/Form.css'
import { useHistory } from "react-router";

function Form({ setPath }) {
    setPath('/form')
    const history = useHistory()

    const email = sessionStorage.getItem("email");
    if (!email)
        history.push('/signup')

    const [error, setError] = useState("");
    const [user, setUser] = useState({
        email: email,
    });
    const [newPass, setNewPass] = useState(false)
    const [retypePass, setRetypePass] = useState(false)
    const [name, setname] = useState("")
    const handleChange = (e) => {
        setUser({
            ...user,
            password: e.target.value,
        });
        if (/[a-z]/.test(e.target.value)) {
            $('#tickLower').css({ visibility: 'visible' })
        }
        else {
            $('#tickLower').css({ visibility: 'hidden' })
        }
        if (/[A-Z]/.test(e.target.value))
            $('#tickUpper').css({ visibility: 'visible' })
        else
            $('#tickUpper').css({ visibility: 'hidden' })
        if (/[0-9]/.test(e.target.value))
            $('#tickNumber').css({ visibility: 'visible' })
        else
            $('#tickNumber').css({ visibility: 'hidden' })
        if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(e.target.value))
            $('#tickSymbol').css({ visibility: 'visible' })
        else
            $('#tickSymbol').css({ visibility: 'hidden' })
        if (e.target.value.length > 7)
            $('#tickLength').css({ visibility: 'visible' })
        else
            $('#tickLength').css({ visibility: 'hidden' })
        if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(e.target.value)) {
            setNewPass(true)
        }
        else {
            setNewPass(false)

        }

    };
    const handleSubmit = () => {
        if (retypePass) {
            console.log(user)
            axios
                .post("/signup", { user, name })
                .then((data) => {
                    Cookies.set("access", data.data.access, { sameSite: 'None', secure: true });
                    Cookies.set("refresh", data.data.refresh, { sameSite: 'None', secure: true });
                    console.log(data.data);
                    history.push('/')
                    setPath('/')
                })
                .catch((err) => console.log(err));
        }

    };

    const handleReEnter = (e) => {
        if (e.target.value === $('#psw').val()) {
            setRetypePass(true)
            $('.passSubmit').css({ cursor: 'pointer' })
        }
        else {
            setRetypePass(false)
            $('.passSubmit').css({ cursor: 'not-allowed' })
        }
    }

    // const accessProtected = async () => {
    //     let accessToken = Cookies.get("access");
    //     let refreshToken = Cookies.get("refresh");
    //     const access = await hasAccess(accessToken, refreshToken);
    //     if (!access) {
    //         console.log("You are not authorized");
    //     } else {
    //         await requestLogin(access, refreshToken);
    //     }
    // };

    // const requestLogin = async (access, refreshToken) => {
    //     return new Promise((resolve, reject) => {
    //         axios
    //             .post(
    //                 "/protected",
    //                 {},
    //                 {
    //                     headers: {
    //                         authorization: `Bearer ${access}`,
    //                     },
    //                 }
    //             )
    //             .then(
    //                 (response) => {
    //                     console.log(response);
    //                     resolve(true);
    //                 },
    //                 async (error) => {
    //                     if (error.response.status === 401)
    //                         setError("You are not authorized!");
    //                     else if (error.response.status === 498) {
    //                         console.log("hello");
    //                         const access = await refresh(refreshToken);
    //                         return await requestLogin(access, refreshToken);
    //                     }
    //                     resolve(false);
    //                 }
    //             );
    //     });
    // };

    return (
        <div className="details-form">
            <div>
                <div class="details-container">
                    <label for="Name">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setname(e.target.value)}
                        required
                    />
                    <label for="password">New Password</label>
                    <input
                        type="password"
                        id="psw"
                        name="password"
                        onChange={(e) => handleChange(e)}
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        required
                    />
                    <label for="password">Re-Enter Password</label>
                    <input
                        type="password"
                        id="retypePass"
                        name="password"
                        onChange={(e) => handleReEnter(e)}
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        required
                        readOnly={newPass ? false : true}
                    />
                    <button onClick={() => handleSubmit()} className='passSubmit' name='form-submit'>Submit</button>
                </div>

                <div id="message">
                    <h3>Password must contain the following:</h3>
                    <div>
                        <CheckCircleOutlineIcon id='tickLower' />
                        <div id="letter" class="invalid">
                            A <b>lowercase</b> letter
                        </div>
                    </div>
                    <div>
                        <CheckCircleOutlineIcon id='tickUpper' />
                        <div id="capital" class="invalid">
                            A <b>capital (uppercase)</b> letter
                        </div>
                    </div>
                    <div>
                        <CheckCircleOutlineIcon id='tickNumber' />
                        <div id="number" class="invalid">
                            A <b>number</b>
                        </div>
                    </div>
                    <div>
                        <CheckCircleOutlineIcon id='tickSymbol' />
                        <div id="length" class="invalid">
                            A <b>symbol</b>
                        </div>
                    </div>
                    <div>
                        <CheckCircleOutlineIcon id='tickLength' />
                        <div id="length" class="invalid">
                            Minimum <b>8 characters</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;
