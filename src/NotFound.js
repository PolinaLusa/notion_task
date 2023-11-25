import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate('/home');
  };

  return (
    <div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.You can visit another pages.</p>
      <button onClick={redirectToHome} className='back'>Go to Home</button>
    </div>
  );
};

export default NotFound;
