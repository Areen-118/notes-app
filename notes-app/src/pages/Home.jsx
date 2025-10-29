import React, { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import AddForm from "../components/AddForm";
import axios from "axios";
import styled from "styled-components";


export default function Home() {
    const [notes, setNotes] = useState([]);
    const [display, setDisplay] = useState(false);
    const token = localStorage.getItem("token") || "";
    const userId = localStorage.getItem("userId") || null;

    const fetchNotes = () => {
        if(token.length){
            axios
                .get("/api/notes", {headers: {Authorization: `Bearer ${token}`,},})
                .then((res) => {
                    //console.log(res);
                    if (res.data)
                    {
                        res.data.forEach((note, i) => {
                            if(note.deleted)
                                res.data.splice(i, 1);
                        });
                        setNotes(res.data || []);
                    }
                        
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else
        {
            let notesLocal = JSON.parse(localStorage.getItem("notes")) || [];
            /*notesLocal.forEach((note, i) => {
                if(note.deleted)
                    notesLocal.splice(i, 1);
            });*/
            notesLocal = notesLocal.filter(note => !note.deleted);
            setNotes(notesLocal);
        }
        
    };


    const display_add = function(){
        setDisplay(!display);
    }

    useEffect(() => {
        fetchNotes();
        const handleStorageChange = () => {
            fetchNotes();
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [display]);

    return (
        <div>
            <div className="cards">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        (!note.deleted && note.userId === userId)?<NoteCard key={note._id} note={note} /> : null
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