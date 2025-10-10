import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!isLogin) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!validatePassword(password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one special character';
      }
      if (password.length < 8) {
        newErrors.password = (newErrors.password || '') + ' Password must be at least 8 characters long';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const url = isLogin ? 'http://localhost:8080/api/auth/login' : 'http://localhost:8080/api/auth/signup';
      const payload = isLogin
        ? { username, password }
        : { username, email, password, role, name };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include', // important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Authentication failed');
        return;
      }

      if (isLogin) {
        // Save only non-sensitive info
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);

        // Redirect based on role
        if (data.role === 'Admin') navigate('/admin-dashboard');
        else if (data.role === 'student') {
          navigate(data.detailsFilled ? `/student/dashboard/${data.username}` : '/fill-details');
        } else if (data.role === 'staff') {
          navigate(data.detailsFilled ? `/staff/dashboard/${data.username}` : '/fill-details');
        } else {
          navigate('/fill-details');
        }
      } else {
        // setMessage('Account created successfully! Redirecting to login...');
        // setTimeout(() => {
        //   setIsLogin(true);
        //   setMessage('');
        // }, 3000);
        setMessage('OTP has been sent to your email. Please verify.');
        navigate('/verify-otp', { state: { email } });
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      navigate('/authpage');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">{isLogin ? 'Sign in to your account' : 'Create a new account'}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-group">
                <User className="input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <User className="input-icon" />
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <EyeOff className="input-icon" /> : <Eye className="input-icon" />}
              </button>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="auth-switch">
          <div className="padding">{isLogin ? 'New to the platform?' : 'Already have an account?'}</div>
          <button onClick={() => setIsLogin(!isLogin)} className="switch-button">
            {isLogin ? 'Create a new account' : 'Sign in to your account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
