import { Link } from "react-router-dom";
import styled from "styled-components";

export default function NoteCard({note}) {
    return (
        <div className="note-card">
            <H2 className="title">
                <Link to={`/details/${note._id}`} style={{textDecoration: 'none', color: "#854D27"}}>{note.title}</Link>
                <Link to={`/details/${note._id}`}><i className="fa-solid fa-ellipsis-vertical"></i></Link>
            </H2>
            <p className="details">
                {note.content.length > 250? note.content.substring(0, 250): note.content}
            </p>
        </div>
    );
}

const H2 = styled.h2`
    &:hover{
        opacity: 0.8;
    }
`;