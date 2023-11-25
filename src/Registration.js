import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext, UserProvider } from './UserContext';

const Registration = () => {
  const navigate = useNavigate();
  const { handleUserLogin } = useContext(UserContext); 

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTimeFormatted = getCurrentTime();
    setCurrentTime(currentTimeFormatted);
    const { email, password, confirmPassword } = formData;

    const errors = {};
    if (!validateEmail(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!password || !confirmPassword) {
      errors.password = 'Passwords cannot be empty';
    } else if (password !== confirmPassword) {
      errors.password = 'Passwords do not match';
    }

    if (Object.keys(errors).length === 0) {
      try {
        const currentTime = getCurrentTime();
        const user = { email, password, createdAt: currentTime };

        const response = await fetch('http://localhost:5001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          const userData = await response.json();
          handleUserLogin(userData); 
          navigate('/signin');
        } else {
          throw new Error('Registration failed.');
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    } else {
      setErrors(errors);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const checkPasswordStrength = (password) => {
    const isValidPassword =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password);

    if (isValidPassword) {
      setPasswordStrength('');
    } else {
      setPasswordStrength(
        'Password should be strong: contain 8 or more characters, at least one uppercase letter, one lowercase letter, and one digit.'
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    if (name === 'confirmPassword' && formData.password === value) {
      setErrors({ ...errors, password: '' });
    } else if (name === 'confirmPassword' && formData.password !== value) {
      setErrors({ ...errors, password: 'Passwords do not match' });
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, password: value });
    checkPasswordStrength(value);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div>
            <h1>Register</h1>
            <p>Please fill in this form to create an account.</p>
            <hr />
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
              className="rect"
            />
            {errors.email && <span>{errors.email}</span>}

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              className="rect"
            />
            {passwordStrength && <span>{passwordStrength}</span>}
            {errors.password && <span>{errors.password}</span>}

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              className="rect"
            />
            {errors.confirmPassword && <span>{errors.confirmPassword}</span>}

            <input type="submit" value="Register" className="my_button" />
            <div>
              <p>Already have an account?<Link to="/signin">Sign in</Link>.</p>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Registration;