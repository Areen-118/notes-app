import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'animate.css/animate.min.css';
import styled from "styled-components";

export default function EditForm() {
    const { id } = useParams();
    const [note, setNote] = useState({
        title: '',
        content: '',
    });
    const [error, setError] = useState("");
    useEffect(() => {
        axios
            .get(`/api/notes/${id}`)
            .then((res) => {
                setNote(res.data);
            })
            .catch((err) => console.log(err));
    }, [id]);
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
        axios
            .put(`/api/notes/${id}`, note)
            .then(() => {
                navigate(`/details/${id}`);
                Swal.fire('Your note has been updated successfully!')
            })
            .catch((err) => console.error(err));
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
