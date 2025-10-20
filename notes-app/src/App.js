import axios from "axios";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    axios.get("/api/notes")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return <h1>Notes App</h1>;
}

export default App;
