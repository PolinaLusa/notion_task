import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditNote = () => {
  const { noteId } = useParams(); 
  const [note, setNote] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [userId, setUserId] = useState('');
  const [createdAt, setCreatedAt] = useState('');
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

  const updateNoteById = async (noteId, updatedNote) => {
    try {
      const response = await fetch(`http://localhost:5001/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedNote,
          userId: note.userId, 
          createdAt: note.createdAt, 
        }),
      });
  
      if (response.ok) {
        return true;
      } else {
        throw new Error('Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      return false;
    }
  };
  

  useEffect(() => {
    const fetchNote = async () => {
      const data = await fetchNoteById(noteId);
      setNote(data);
      setEditedTitle(data.title);
      setEditedContent(data.content);
      setUserId(data.userId);
      setCreatedAt(data.createdAt);
    };

    fetchNote();
  }, [noteId]);

  const handleUpdate = async () => {
    const updatedNote = {
      title: editedTitle,
      content: editedContent,
    };

    const updated = await updateNoteById(noteId, updatedNote);
    if (updated) {
      navigate(`/note/${noteId}`);
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
      <h2>Edit Note</h2>
      <hr></hr>
      <label htmlFor="edited-title">Title:</label>
      <input
        type="text"
        id="edited-title"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
      />
      <label htmlFor="edited-content">Content:</label>
      <textarea
        id="edited-content"
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
      ></textarea>
      <button onClick={handleUpdate} className="create">Save changes</button>
      <Link to={`/note/${noteId}`}className='back'>Back to note view</Link>
    </div>
    </div>
  );
};

export default EditNote;
