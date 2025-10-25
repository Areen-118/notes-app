import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditForm() {
    const { id } = useParams();
    const [note, setNote] = useState({
        title: '',
        content: '',
    });
    useEffect(() => {
        axios
            .get(`/api/notes/${id}`)
            .then((res) => {
                setNote(res.data);
            })
            .catch((err) => console.log(err));
    }, [id]);
    const changeHandler = (event) => {
        const {name, value} = event.target;
        setNote({ ...note, [name]: value });
    }

    const navigate = useNavigate();
    const submitHandler = (event) => {
        event.preventDefault();
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
                <button onClick={submitHandler}>Save Changes</button>
            </form>
        </div>
  )
}
