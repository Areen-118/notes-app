import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailCard from "../components/DetailCard";
import { findNote } from "../utils/noteUtils";

export default function NoteDetails() {
    const { _id } = useParams();
    const [note, setNote] = useState({
        _id: "",
        title: "",
        content: "",
    });
    const token = localStorage.getItem("token") || "";
    const existing = JSON.parse(localStorage.getItem("notes")) || [];
    useEffect(() => {
        if(token.length)
        {
            axios
            .get(`/api/notes/${_id}`)
            .then((res) => {
                setNote(res.data);
            })
            .catch((err) => console.log(err));
        }
        else
        {
            setNote(findNote(_id, existing));
        }
        console.log(note);
    }, [_id]);
    return (
        <div className="container">
            <DetailCard note={note} />
        </div>
    );
}
