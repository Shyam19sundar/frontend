import React, { useState, useEffect } from "react";
import axios from "../axios.js";
import Countdown from "react-countdown";
import $ from "jquery";
import "../css/Verify.css";
import { useHistory, withRouter } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

function Verify() {
    const history = useHistory();
    const email = sessionStorage.getItem("email");
    if (!email)
        history.push('/signup')
    useEffect(() => {
        window.onbeforeunload = function () {
            return true;
        };
        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    const notify = (message) => toast.error(message);

    const handleOTP = () => {
        console.log("clicked");
        console.log($(".otp_input").val());
        axios
            .post("/otp-verify", {
                email: email,
                otp: $(".otp_input").val(),
            })
            .then((res) =>
                res.status == 200 ? history.push("/form") : console.log("")
            ).catch(err => {
                if (err.response.status === 401)
                    notify('Incorrect OTP')
            })
    };

    return (
        <div className="verify">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={true} />
            <div className='verify-container'>
                <h2>Hi, {email}</h2>
                <p>We have send a verification mail to your email. Please verify that!</p>
                <input type="text" placeholder="OTP" className="otp_input" />
                <button
                    onClick={(e) => {
                        handleOTP();
                    }}
                >Submit</button>
                <Countdown
                    className="count"
                    date={Date.now() + 300000}
                    onComplete={() => {
                        if (window.confirm("OTP expired, Please try again later :/")) {
                            history.push("/SignUp");
                        } else {
                            console.log("Nothing");
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default withRouter(Verify);
