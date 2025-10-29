import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { findNote } from "../utils/noteUtils.js";

export default function DetailCard({ note }) {
    const existing = JSON.parse(localStorage.getItem("notes")) || [];
    const token = localStorage.getItem("token") || "";
    const navigate = useNavigate();
    const deleteNote = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                if(token.length)
                {
                    console.log(note);
                    note.deleted = true;
                    axios
                    .put(`/api/notes/${note._id}`, note)
                    .then(() => {
                        let oldNote = findNote(note, existing);
                        if(oldNote)
                        {
                            let index =  existing.findIndex(notetofind => notetofind._id === note._id);
                            existing.splice(index, 1);
                            localStorage.setItem("notes", JSON.stringify(existing));
                        }
                        navigate("/");
                        Swal.fire(
                            "Deleted!",
                            "Your Note has been deleted.",
                            "success"
                        );
                    })
                    .catch((err) => console.error(err));
                }
                else
                {
                    let index =  existing.findIndex(notetofind => notetofind._id === note._id);
                    existing.splice(index, 1);
                    note.deleted = true;
                    existing.push(note);
                    localStorage.setItem("notes", JSON.stringify(existing));
                    navigate("/");
                        Swal.fire(
                            "Deleted!",
                            "Your Note has been deleted.",
                            "success"
                    );
                }
            } else {
                return;
            }
        });
    };
    return (
        <div className="note-details">
            <h1 className="title">{note.title}</h1>
            <P className="content">{note.content}</P>
            <div className="action">
                <Link className="detail-button" to={`/edit/${note._id}`}>
                    {" "}
                    Edit
                </Link>
                <button className="detail-button" onClick={deleteNote}>
                    Delete
                </button>
            </div>
        </div>
    );
}

const P = styled.p`
    max-width: 60%;
    color: #8E443D;
    font-size: 1.2rem;
    letter-spacing: 1px;
`;