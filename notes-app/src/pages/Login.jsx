import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import 'animate.css/animate.min.css';
import styled from "styled-components";
import {useNavigate} from 'react-router-dom';
import { findNote } from "../utils/noteUtils.js";
import {jwtDecode} from "jwt-decode";

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

      axios
        .post(`/api/auth/${type}`, user)
        .then((res) => {
            console.log(res);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", res.config.data);
            if(type === "login")
            {
              let userId = jwtDecode(res.data.token).userId;
              console.log(jwtDecode(res.data.token));
              localStorage.setItem("userId", userId);
              updateUserId(userId);
              window.dispatchEvent(new Event("storage"));
              syncDbAndLocal(res.data, res.data.token, userId);
              navigate('/');
            }
            else
            {
              toggleType();
              localStorage.setItem(`${user.email}`, JSON.stringify(user));
            }

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
            if(err.response)
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

async function syncDbAndLocal(response, token, userId) {
  const existing = JSON.parse(localStorage.getItem("notes")) || [];

  try {
    const res = await axios.get(`/api/notes`, {
      headers: {
      Authorization: `Bearer ${token}`,
      },
    });
    const dbNotes = res.data;

    for (let note of existing) {
      if(note.userId === userId)
      {
        const dbNote = findNote(note, dbNotes);

        const localTime = new Date(note.updatedAt).getTime();
        const dbTime = new Date(dbNote.updatedAt).getTime();
        console.log(note, dbNote);

        if (dbNote) {
          if (dbNote.deleted && note.deleted) continue;

          if (note.deleted && !dbNote.deleted) {
            await axios.put(`/api/notes/${note._id}`, note ,
              {headers: {Authorization: `Bearer ${token}`,},});
            continue;
          }

          if (dbNote.deleted && !note.deleted) {
            let index =  existing.findIndex(notetofind => notetofind._id === note._id);
            existing.splice(index, 1);
            continue;
          }

          if (localTime > dbTime) {
            await axios.put(`/api/notes/${note._id}`, note ,
              {headers: {Authorization: `Bearer ${token}`,},});
          } 
          else if (dbTime > localTime) {
            let index =  existing.findIndex(notetofind => notetofind._id === note._id);
            existing.splice(index, 1);
            existing.push(dbNote);
          }
        }

        else if (!dbNote && !note.deleted) {
          await axios.post(`/api/notes`,note ,
            {headers: {Authorization: `Bearer ${token}`,},});
        }
        else if(!dbNote && note.deleted)
        {
          let index =  existing.findIndex(notetofind => notetofind._id === note._id);
          existing.splice(index, 1);
        }
      }
    }

    const Month = 30 * 24 * 60 * 60 * 1000;

    dbNotes.forEach(async (dbNote) => {
        const localNote = findNote(dbNote, existing);
        if(localNote && localNote.userId === userId)
        {
          if (!localNote && !dbNote.deleted) existing.push(dbNote);
          if(localNote && dbNote.deleted){
              let index =  existing.findIndex(notetofind => notetofind._id === dbNote._id);
              existing.splice(index, 1);
          }
          if (dbNote.deleted && Date.now() - new Date(dbNote.updatedAt).getTime() > Month) {
              try {
                  await axios.delete(`/api/notes/${dbNote._id}`, {headers: {Authorization: `Bearer ${token}`,},});
                  let index =  existing.findIndex(notetofind => notetofind._id === dbNote._id);
                  existing.splice(index, 1);
              } catch (err) {
                console.error("Failed to hard-delete note:", dbNote, err);
              }
          }
      }
    });

    localStorage.setItem("notes", JSON.stringify(existing));
  } catch (err) {
    console.error(err);
  }
}

function updateUserId(userId) {
  const existing = JSON.parse(localStorage.getItem("notes")) || [];
  for (let note of existing) {
    if(note.userId === null)
      note.userId = userId;
  }
  localStorage.setItem("notes", JSON.stringify(existing));
}