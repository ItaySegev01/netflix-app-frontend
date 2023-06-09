import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { loginCall } from '../../auth/authApiCalls';
import { getError, isValidEmail } from '../../Utils';
import { toast } from 'react-toastify';
import './LoginPage.scss';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isFetching, user, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const { search } = useLocation();

  const redirectURL = new URLSearchParams(search).get('redirect');
  const redirect = redirectURL ? redirectURL : '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, redirect, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    if (!password || password.trim().length < 5 || /\s/.test(password)) {
      toast.error('Please enter a password, enter at least 5 characters');
      return;
    }
    try {
      await loginCall({ email, password }, dispatch);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
        </div>
      </div>
      <div className="container">
        <form>
          <h1>Sign In</h1>
          <small>
            (this is a demo app , you may use: email: admin@example.com
            <br />
            password: 12345)
          </small>
          <br/>
          <input
            type="email"
            placeholder="Email or phone number"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br></br>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br/>
          <button
            className="loginButton"
            onClick={handleLogin}
            disabled={isFetching}
          >
            Sign In
          </button>
          <span>
            New to Netflix?{' '}
            <Link className="link link-signin" to="/register">
              Sign up now.
            </Link>
          </span>
          <small>
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot.
          </small>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
