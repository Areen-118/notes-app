import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

export default function DetailCard({ note }) {
    
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
                axios
                    .delete(`/api/notes/${note._id}`)
                    .then(() => {
                        navigate("/");
                        Swal.fire(
                            "Deleted!",
                            "Your Note has been deleted.",
                            "success"
                        );
                    })
                    .catch((err) => console.error(err));
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
