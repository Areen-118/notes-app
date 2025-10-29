import React, { useEffect, useState } from "react";
import 'animate.css/animate.min.css';
import styled from "styled-components";


export default function Profile({display, click_display}) {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    });
    

    useEffect(() => 
    {
      const currentUser = JSON.parse(localStorage.getItem("user")) || {
        username: "no user data exist, please login!",
        email: null,
      };
      let savedUser = currentUser;
      if(currentUser.email){
         savedUser = JSON.parse(localStorage.getItem(`${currentUser.email}`)) || null;
      }
      setUser(savedUser);
    }, []);
    
    return (
        <Div>
            <H1 className="headline"> 
               <span>User Profile</span> 
            </H1>
            <Ul>
              <Li>username: <Span>{user.username}</Span> </Li>
              <Li>email: <Span>{user.email? user.email : null }</Span></Li>
            </Ul>
        </Div>
    );
}

const Div = styled.div`
    width: 75%;
    padding: 2rem;
    border-radius: 1rem;
    scrollbar-color: #e99500 #f7f5f2;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`;

const H1 = styled.h1`
    display: flex;
    gap:1.5rem;
    justify-content:center;
`

const Ul = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 1rem auto;
  font-size: 1.8rem;
  color: #854d27;
  width: 37%;
`

const Li = styled.li`
  font-family: 'Kaushan Script' !important;
  margin: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Span = styled.span`
  color: #333
`