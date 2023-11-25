import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './Registration';
import SignIn from './SignIn';
import Home from './Home';
import Notes from './Notes';
import CreateNote from './CreateNote';
import EditNote from './EditNote'; 
import NoteView from './NoteView'; 
import NotFound from './NotFound'; 
import { UserProvider } from './UserContext';
import Footer from "./Footer";

const App = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    fetch('http://localhost:5001/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data.users || []);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const yourSetLoggedInFunction = (value) => {
    setIsLoggedIn(value);
  };

  return (
    <Router>
      <UserProvider value={{ currentUser, setCurrentUser, isLoading }}>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/home"
            element={<Home
              users={users}
              isLoading={isLoading}
              setCurrentUser={setCurrentUser}
              setLoggedIn={yourSetLoggedInFunction}
              isLoggedIn={isLoggedIn}
            />}
          />
          <Route path="/notes" element={<Notes users={users} isLoading={isLoading} />} />
          <Route path="/create-note" element={<CreateNote />} />
          <Route path="/note/:noteId" element={<NoteView />} /> 
          <Route path="/edit/:noteId" element={<EditNote />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </UserProvider>
    </Router>
  );
};

export default App;
