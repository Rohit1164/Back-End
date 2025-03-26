import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((res) => {
        setJokes(res.data.jokes);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <>
      <h1 className="read-the-docs">Connect Frontend to Backend</h1>
      <h2>Jokes: {jokes.length}</h2>

      {jokes.map((joke) => (
        <div key={joke.id}>
          <p>{joke.title}</p>
        </div>
      ))}
    </>
  );
}

export default App;
