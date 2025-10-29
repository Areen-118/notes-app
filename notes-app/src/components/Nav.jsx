import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import Swal from "sweetalert2";

export default function Nav() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const goToLogin= () =>{
    navigate('/login');
  }

   useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

  const handleLogoutClick = () =>{
    Swal.fire({
            title: "Do you want to logout",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                setToken("");
                localStorage.setItem("token", "");
                localStorage.setItem("user", "");
                window.dispatchEvent(new Event("storage"));
                navigate("/");
            } else {
                return ;
            }
        });
  }

  return (
    <nav>
      <NavItem>
        <Link to={'/'} ><H3>Notes</H3></Link>
      </NavItem>
      <NavItem>
        <Link to={'/tags'} ><H3>Tags</H3></Link>
      </NavItem>
      <NavItem>
        <Link to={'/Profile'} ><H3>Profile</H3></Link>
      </NavItem>
      <Logo>
          <H2>NOTES APP</H2>
      </Logo>
      <div className="action">
        {token.length?
        <button onClick={handleLogoutClick}>Logout</button>
        :<button onClick={goToLogin}>Login/Register</button>} 
      </div>
    </nav>
  )
}

const H3 = styled.h3`
  color: #8E443D;
  font-size: 1.1rem;
  font-family: "Kaushan Script", cursive;
`;
const NavItem= styled.div`
  flex: 1;

  &:hover {
    opacity:0.7;
  }
`;

const Logo = styled.div`
  flex:4;
`;

const H2 = styled.h2`
  font-size: 2rem;
  font-family: "Yellowtail", cursive;
  font-weight: 900;
  color: #ECA400;
  text-align: center;
  text-shadow: -1px 5px 0px rgba(23, 33, 33, 0.35)
`;