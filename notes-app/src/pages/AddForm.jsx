import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import 'animate.css/animate.min.css';
import styled from "styled-components";

export default function AddForm({display, click_display}) {
    const [note, setNote] = useState({
        title: "",
        content: "",
    });

    const changeHandler = (event) => {
      const {name, value} = event.target;
      setNote( {...note, [name]: value});
    };


    const submitHandler = (event) => {
      event.preventDefault();
      console.log(note);
      axios
        .post("/api/notes", note)
        .then(() => {
          
          click_display();
          Swal.fire({
            title: 'Your note has been added successfully!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
        })
        .catch((err) => {console.log(err);});
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
