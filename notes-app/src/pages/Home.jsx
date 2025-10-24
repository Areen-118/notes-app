import React, { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import AddForm from "./AddForm";
import axios from "axios";
import styled from "styled-components";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const [display, setDisplay] = useState(false);

    const fetchNotes = () => {
            axios
                .get("/api/notes")
                .then((res) => {
                    if (res.data.content) {
                        console.log(res.data)
                        setNotes(res.data.content);
                    } else {
                        setNotes([]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
    };

    const display_add = function(){
        setDisplay(!display);
    }

    useEffect(() => {
        fetchNotes();
    }, []);
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