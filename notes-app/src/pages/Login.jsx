import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import 'animate.css/animate.min.css';
import styled from "styled-components";
import {useNavigate} from 'react-router-dom';

export default function Login({display, click_display}) {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    });
    let [type, setType] = useState("login");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const toggleType = () => {
        if(type === "login")
            setType("register");
        else
            setType("login");
    }

    const changeHandler = (event) => {
        setError("");
        const {name, value} = event.target;
        setUser( {...user, [name]: value});
    };

    const submitHandler = (event) => {
      event.preventDefault();
      if(!user.email.length || !user.password.length || (!user.username.length && type=== "register")){
            setError("Fields cannot be empty!");
            return ;
      }
      console.log(user);

      axios
        .post(`/api/auth/${type}`, user)
        .then((res) => {
            console.log("after login: ");
            console.log(res.data);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", res.config.data);
            window.dispatchEvent(new Event("storage"));
            syncDbAndLocal(res.data);

            navigate('/');
            Swal.fire({
                title: `User ${type}ed successfully!`,
                showClass: {
                popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
                }
          })
        })
        .catch((err) => {
            console.log(err);
            setError(err.response.data.message);
        });
    };

    
    return (
        <Div>
            <H1 className="headline"> 
                <span className={type === "login"? "": "inactive"} 
                onClick={toggleType}>
                    Login 
                </span> 
                <span className={type === "register"? "": "inactive"} 
                onClick={toggleType}> 
                Register
                </span>
            </H1>
            <form className="login-form">
                {type === "register"? 
                <input
                    type="text"
                    name="username"
                    minLength={1}
                    maxLength={20}
                    value={user.username}
                    onChange={changeHandler}
                    placeholder="username"
                    required
                />
                : null }
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={changeHandler}
                    placeholder="email"
                    required
                />
                <input
                    type="password"
                    minLength={5}
                    name="password"
                    value={user.password}
                    onChange={changeHandler}
                    placeholder="password"
                    required
                />
                {error.length > 0 ? <ErrorP className="animate__animated animate__shakeX">{error}</ErrorP>: null}
                <button type="submit" onClick={submitHandler}>{type}</button>
            </form>
        </Div>
    );
}

const Div = styled.div`
    width: 75%;
    padding: 2rem;
    border-radius: 1rem;
    scrollbar-color: #e99500 #f7f5f2;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`;

const H1 = styled.h1`
    display: flex;
    gap:1.5rem;
    justify-content:center;
`

const ErrorP = styled.p`
  color: red;
  font-size : 1.2rem;
`
function syncDbAndLocal(response){
        const existing = JSON.parse(localStorage.getItem("notes")) || [];
        axios.get("/api/notes", response.userId).then( (res) => {
            existing.forEach(note => {
                let dbNote = findNote(note , res.data);
                if(dbNote)
                {
                    if(dbNote.title !== note.title || dbNote.content !== note.content)
                    {
                        axios.put(`/api/notes/${dbNote.id}`, note)
                        .catch((err) => (console.log(err)));
                    }
                }
                else
                {
                    axios.post(`/api/notes/`, note)
                    .catch((err) => (console.log(err)));
                }
                
            });
        }).catch((err) => (console.log(err)));

}


function findNote(note, searchlist)
{
    let found = null;
    searchlist.forEach(element => {
        if(element.id === note.id)
            found = element.id;
    });
    return found;
}


