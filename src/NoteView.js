import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const NoteView = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const navigate = useNavigate();

  const fetchNoteById = async (noteId) => {
    try {
      const response = await fetch(`http://localhost:5001/notes/${noteId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching note:', error);
      return null;
    }
  };

  const deleteNoteById = async (noteId) => {
    try {
      await fetch(`http://localhost:5001/notes/${noteId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchNote = async () => {
      const data = await fetchNoteById(noteId);
      setNote(data);
    };

    fetchNote();
  }, [noteId]);

  const handleDelete = async () => {
    const deleted = await deleteNoteById(noteId);
    if (deleted) {
      navigate('/notes');
    }
  };

  if (!note) {
    return <div>Loading...</div>;
  }


  return (
    <div>
          <div className="container">
                <div className="menu">
                   <Link to="/home" className="about">Home</Link>
                   <Link to="/notes" className="notes">Notes</Link>
                   <Link to="/signin" className="notes">Sign Out</Link>
                </div>
          </div>
    <div className='box'>
    <h2>Note View</h2>
    <hr></hr>
      <h2>Title: {note.title}</h2>
      <p>Content: {note.content}</p>
      <div className="note-actions">
        <Link to={`/edit/${noteId}`} className="edit-note">Edit</Link>
        <button onClick={handleDelete} className="delete-note">Delete</button>
      </div>
      <Link to="/notes" className='back'>Back to notes</Link>
      </div>
    </div>
  );
};

export default NoteView;
