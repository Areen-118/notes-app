import Nav from "./components/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoteDetails from "./pages/NoteDetails";
import EditForm from "./pages/EditForm";
import Login from "./pages/Login";
import Profile from "./pages/Profile";


function App() {
    return (
        <>
            <Router>
                <Nav />
                <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/details/:_id"} element={<NoteDetails />} />
                    <Route path={"/edit/:_id"} element={<EditForm />} />
                    <Route path={"/login"} element={<Login />} />
                    <Route path={"/profile"} element={<Profile />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
