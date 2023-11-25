import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const CreateNote = () => {
    const { loggedInUser } = useContext(UserContext);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (noteTitle.trim() !== '' && noteContent.trim() !== '' && loggedInUser) {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];

            const noteData = {
                title: noteTitle,
                content: noteContent,
                userId: loggedInUser.id,
                createdAt: formattedDate,
            };

            try {
                const response = await fetch('http://localhost:5001/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(noteData),
                });

                if (!response.ok) {
                    throw new Error('Failed to create note');
                }

                const data = await response.json();
                console.log('Note successfully created:', data);
                navigate(`/note/${data.id}`);
            } catch (error) {
                console.error('Error creating note:', error);
            }
        } else {
            console.error('Error: Title and content cannot be empty.');
        }
    };

    const handleTitleChange = (e) => {
        setNoteTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setNoteContent(e.target.value);
    };
    const handleSignOutAndRedirect = () => {
        navigate('/signin');
    };


    return (
        <div>
            <div className="container">
                <div className="menu">
                   <Link to="/home" className="about">Home</Link>
                   <Link to="/notes" className="notes">Notes</Link>
                   <Link to="/signin" className="notes">Sign Out</Link>
                </div>
            </div>
            <form onSubmit={handleSubmit} className='box'>
            <h2 style={{ textAlign: 'center' }}>Create a note</h2>
            <hr></hr>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" value={noteTitle} onChange={handleTitleChange} />
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    rows="4"
                    cols="50"
                    value={noteContent}
                    onChange={handleContentChange}
                />
                <button type="submit" className="create-note">Create a note</button>
            </form>
        </div>
    );
};

export default CreateNote;
