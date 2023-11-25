import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const Notes = () => {
  const { loggedInUser } = useContext(UserContext);
  const [userNotes, setUserNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        if (!loggedInUser) return;
        const response = await fetch(
          `http://localhost:5001/notes?userId=${loggedInUser.id}`
        );
        if (response.ok) {
          const data = await response.json();

          setUserNotes(data || []);
        } else {
          throw new Error("Failed to fetch user notes");
        }
      } catch (error) {
        console.error("Error fetching user notes:", error);
      }
    };

    if (loggedInUser) {
      fetchUserNotes();
    }
  }, [loggedInUser]);

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:5001/notes/${noteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUserNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== noteId)
        );
      } else {
        throw new Error("Error deleting note");
      }
    } catch (error) {
      console.error(`Error deleting note with ID ${noteId}:`, error);
    }
  };

  const handleSignOutAndRedirect = () => {
    navigate("/signin");
  };

  return (
    <div className="container">
      <div className="menu">
        <Link to="/home" className="about">Home</Link>
        <Link to="/notes" className="notes">Notes</Link>
        <Link to="/signin" className="notes">Sign Out</Link>
      </div>
      <div className='box'>
      <h2 style={{ textAlign: "center" }}>Notes</h2>
      {userNotes.length > 0 ? (
          <ul className="notes-list">
            {userNotes.map((note) => (
              <li key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.createdAt}</p>
                <div className="note-icons">
                <Link to={`/edit/${note.id}`}>
                <span
               role="img"
               aria-label="Edit a note"
               >
                   ✏️
                 </span>
                </Link>
                  <span
                    role="img"
                    aria-label="Delete a note"
                    onClick={() => deleteNote(note.id)}
                  >
                    🗑
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>You don't have any notes right now.</p>
        )}
        <hr></hr>
        <Link to="/create-note" className="create">Create a note</Link>
      </div>
    </div>
  );
};

export default Notes;
