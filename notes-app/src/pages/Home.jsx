import React, { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import AddForm from "../components/AddForm";
import axios from "axios";
import styled from "styled-components";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [display, setDisplay] = useState(false);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const fetchNotes = () => {
        if(token.length){
            axios
                .get("/api/notes")
                .then((res) => {
                    console.log(res);
                    if (res.data)
                        setNotes(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else
            setNotes(JSON.parse(localStorage.getItem("notes")) || []);
    };

    const display_add = function(){
        setDisplay(!display);
    }

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [display]);

    return (
        <div>
            <div className="cards">
                {notes && notes.length > 0 ? (
                    notes.map((note) => (
                        <NoteCard key={note._id} note={note} />
                    ))
                ) : (
                    <Para>No Notes To Show</Para>
                )}
            </div>
            <button className='add-button' onClick={display_add}>+</button>
            {display? <AddForm display={display} click_display={display_add} />: null}
        </div>
    );
}

const Para = styled.p`
    justify-content: center;
    display: flex;
    align-items: center;
    height: 50vh;
    color: #aaa;
    letter-spacing: 1px;
    font-size: 1.3em;
`;