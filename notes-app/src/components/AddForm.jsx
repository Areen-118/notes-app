import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import 'animate.css/animate.min.css';
import styled from "styled-components";
import { findNote } from "../utils/noteUtils.js";

export default function AddForm({display, click_display}) {
    const [note, setNote] = useState({
        _id: crypto.randomUUID(),
        title: "",
        content: "",
        deleted: false,
        updatedAt: Date.now(),
    });
    const [error, setError] = useState("");
    const token = localStorage.getItem("token") || "";
    const user = localStorage.getItem("user") || "";

    const changeHandler = (event) => {
      setError("");
      const {name, value} = event.target;
      setNote( {...note, [name]: value});
    };

    const saveNewNoteToLocal = (newNote) => {
      const existing = JSON.parse(localStorage.getItem("notes")) || [];
      let found = findNote(newNote, existing);
      if(!found){
        existing.push(newNote);
        localStorage.setItem("notes", JSON.stringify(existing));
      }
    }
    const showPopup = () =>{
      click_display();
      Swal.fire({
            title: 'Your note has been added successfully!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
      });
    }


    const submitHandler = (event) => {
      event.preventDefault();

      if(!note.title.length || !note.content.length){
            setError("Title or content cannot be empty!")
            return ;
      }
      if(token.length){
      axios
        .post("/api/notes", note)
        .then(() => {
          saveNewNoteToLocal(note);
          showPopup();
        })
        .catch((err) => {console.log(err);});
      }
      else{
        saveNewNoteToLocal(note);
        showPopup()
      }
    };
    return (
        <Background>
            <Div>
              <CloseButton onClick={click_display}>X</CloseButton>
              <h1 className="headline">
                  Add <span>Note</span>
              </h1>

              <form className="note-form">
                  <input
                      type="text"
                      name="title"
                      value={note.title}
                      onChange={changeHandler}
                      placeholder="Title of Note ..."
                      required
                  />
                  <textarea
                      name="content"
                      rows="5"
                      defaultValue={note.content}
                      onChange={changeHandler}
                      placeholder="Descride Your Note ..."
                      required
                  ></textarea>
                  {error.length > 0 ? <ErrorP className="animate__animated animate__shakeX">{error}</ErrorP>: null}
                  <button type="submit" onClick={submitHandler}>Save Note</button>
              </form>
            </Div>
        </Background>
    );
}

const Div = styled.div`
  width: 60%;
  position: fixed;
  top: 2rem;
  justify-self: anchor-center;
  background: #f7f5f2;
  padding: 2rem;
  border-radius: 1rem;
  overflow-y: scroll;
  max-height: 94vh;
  scrollbar-color: #e99500 #f7f5f2;
`;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: #00000029;
  position: fixed;
  top: 0;
  display: flex;
`;

const CloseButton = styled.button`
  font-size: 2.5rem;
  color: black;
  border: none;
  background: none;
  cursor: pointer;
  font-family: "Acme", sans-serif;
  width: 3.5rem;
  margin-left: auto;
  display: block;
`;

const ErrorP = styled.p`
  color: red;
  font-size : 1.2rem;
`

