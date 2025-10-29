import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'animate.css/animate.min.css';
import styled from "styled-components";
import { findNote } from "../utils/noteUtils.js";

export default function EditForm() {
    const { _id } = useParams();
    const token = localStorage.getItem("token") || "";
    let localNotes = JSON.parse(localStorage.getItem("notes")) || [];
    let localNote = findNote(note, localNotes);
    const [note, setNote] = useState({
        title: '',
        content: '',
        deleted: false,
        updatedAt: Date.now(),
    });
    const [error, setError] = useState("");
    useEffect(() => {
        if(token.length){
            axios
            .get(`/api/notes/${_id}`)
            .then((res) => {
                setNote(res.data);
            })
            .catch((err) => console.log(err));
        }
        else
            setNote(localNote);
        
    }, [_id]);
    const changeHandler = (event) => {
        setError("");
        const {name, value} = event.target;
        setNote({ ...note, [name]: value });
    }

    const navigate = useNavigate();
    const submitHandler = (event) => {
        event.preventDefault();
        if(!note.title.length || !note.content.length){
            setError("Title or content cannot be empty!")
            return ;
        }
        setNote({ ...note, updatedAt: Date.now() });
        if(token.length){
            axios
            .put(`/api/notes/${_id}`, note)
            .then(() => {
                navigate(`/details/${_id}`);
                Swal.fire('Your note has been updated successfully!')
            })
            .catch((err) => console.error(err));
        }
        let index =  localNotes.findIndex(notetofind => notetofind._id === note._id);
        localNotes.splice(index, 1);
        localNotes.push(note);
        localStorage.setItem("notes", JSON.stringify(localNotes));
    }
  return (
    <div>
        <h1 className="headline">
            Edit <span>Note</span>
        </h1>
        <form className="note-form">
            <input
                type="text"
                name="title"
                value={note.title}
                onChange={changeHandler}
                placeholder="Title of Note ..."
            />
            <textarea
                name="content"
                rows="5"
                defaultValue={note.content}
                onChange={changeHandler}
                placeholder="Descride Your Note ..."
            ></textarea>
            {error.length > 0 ? <ErrorP className="animate__animated animate__shakeX">{error}</ErrorP>: null}
            <button onClick={submitHandler}>Save Changes</button>
        </form>
    </div>
  )
}

const ErrorP = styled.p`
  color: red;
  font-size : 1.2rem;
`
