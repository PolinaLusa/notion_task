import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserProvider } from './UserContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { handleUserLogin, loggedIn } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/users')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setIsLoading(false);
          setUsers(data);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleSignIn = (event) => {
    event.preventDefault();
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      handleUserLogin(user); 
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }}
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="container">
      <form onSubmit={handleSignIn}>
        <fieldset>
          <div>
            <h1>Sign In</h1>
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="rect"
              value={email}
              onChange={handleEmailChange}
            />
            <label htmlFor="password"><b>Password</b></label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="rect"
              value={password}
              onChange={handlePasswordChange}
            />
            <input type="submit" value="Sign In" className="my_button" />
            <div>
              <p>Don't have an account yet? Register <a href="/">here</a>.</p>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default SignIn;
