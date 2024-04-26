import React from "react";
import "./Login.css";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const userLoggedIn = () =>{
    toast.success("User logged in successfully");

}

const userLoginFail = () =>{
    toast.error("Failed to login");
}

const Login = ({setShowLogin, myStorage, setCurrentUser}) => {
    const nameRef = useRef();
    const passwordRef = useRef();

    const onhandleSubmit = async (e) => {
        e.preventDefault();
        const newUser ={
            userName: nameRef.current.value,
            password: passwordRef.current.value,
        };
        try{
            const response = await axios.post('/users/login', newUser);
            //produce a success notification
           userLoggedIn();
            setCurrentUser(response.data.userName);
            myStorage.setItem('user', JSON.stringify(response.data.userName));
            setShowLogin(false);
        }
        catch(e){
            //produce an error notification
            userLoginFail();
        }
    }

    return (
    <div className='login_container'>
        <div className="application">
            <ExitToAppIcon className="login_icon" />
            Login to your account
        </div>
        <form onSubmit={onhandleSubmit}>
            <input type="text" placeholder= "user name" ref={nameRef}  />
            <input type="password" placeholder= "password" ref={passwordRef} />
            <button className="login_button" type="submit">Sign in</button>
        </form>
        <CancelIcon className="close_login" onClick={()=>setShowLogin(false)} />
    </div>
    )
    };
export default Login;