import React, {useRef} from 'react';
import './Register.css';
import CancelIcon from '@mui/icons-material/Cancel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';
import {toast} from 'react-toastify';

const userRegisterSuccess = () => {
    toast.success("signed up successfully!")
  }

  const userRegisterFail = () => {
    toast.error("sign up failed!")
  }


const Register = ({setShowRegister}) => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();

    const onhandleSubmit = async (e) => {
        e.preventDefault();
        const newUser ={
            userName: nameRef.current.value,
            email: emailRef.current.value,
            password: passRef.current.value,
        };
        try{
            await axios.post('/users/register', newUser);
            //produce a success notification
            userRegisterSuccess();
            setShowRegister(false);
        }
        catch(e){
            //produce an error notification
            userRegisterFail();}
    }

    return(
        <div>
            <div className='register_container'>
                <div className="application">
                    <ExitToAppIcon className="register_icon" />
                    create your profile
                </div>
                <form onSubmit={onhandleSubmit}>
                    <input type="text" placeholder= "user name" ref ={nameRef} />
                    <input type="email" placeholder= "email" ref={emailRef} />
                    <input type="password" placeholder= "password" ref={passRef} />
                    <button className="register_button" type="submit">Sign Up</button>
                </form>
                <CancelIcon className="close_register" onClick={()=>setShowRegister(false)} />
            </div>
        </div>
    );
}
export default Register;