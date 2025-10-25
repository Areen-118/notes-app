import Nav from "./components/Nav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoteDetails from "./pages/NoteDetails";
import EditForm from "./pages/EditForm";


function App() {
    return (
        <>
            <Router>
                <Nav />
                <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/details/:id"} element={<NoteDetails />} />
                    <Route path={"/edit/:id"} element={<EditForm />} />
                    {/* TODO: <Route path={"/tags"} element={<Tags />} /> */}
                    {/* <Route path={"/profile"} element={<Profile />} /> */}
                </Routes>
            </Router>
        </>
    );
}

export default App;
