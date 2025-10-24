import { Link } from "react-router-dom";
import styled from "styled-components";

export default function NoteCard({note}) {
    return (
        <div className="note-card">
            <H2 className="title">
                <Link to={`/details/${note._id}`} style={{textDecoration: 'none'}}>{note.title}</Link>
                <Link to={`/details/${note._id}`}><i className="fa-solid fa-ellipsis-vertical"></i></Link>
            </H2>
            <P className="details">
                {note.content}
            </P>
        </div>
    );
}

const H2 = styled.h2`
    color: #854D27;
    font-family: "Acme", sans-serif;

    &:hover{
        opacity: 0.8;
    }
`;
const P = styled.p`
    font-family: "Acme", sans-serif;
`;