import React, { useEffect } from 'react';
import env from 'react-dotenv';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

import { routes } from '../pages';

const redirect_uri = env.REACT_ENV === 'dev' ? `http://localhost:${env.PORT}` : 'https://async-music-collab.vercel.app';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        {routes.map((route, index) => route.navLabel && (
          <li key={index}>
            <Link to={route.path}>{route.navLabel}</Link>
            {index !== routes.length - 1 && <span className="dot">•</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Header = ({ token, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.localStorage.setItem("token", token);
      navigate(location.state?.from || '.', { replace: true, state: { hash: '' } });
      setToken(token);
    }
  }, [navigate, setToken, location]);

  const authorized = Boolean(token);

  const handleAuthorize = () => {
    const currentPath = window.location.pathname;
    window.localStorage.setItem('previousPath', currentPath);
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${env.SPOTIFY_CLIENT_ID}&redirect_uri=${redirect_uri}/spotify-callback&response_type=token&scope=user-top-read user-read-currently-playing`;
  };

  return (
    <header className="App-header">
      <Navigation />
      <h1>Async Music Collab</h1>
      <button
        className={authorized ? "authorize-button authorized" : "authorize-button"}
        onClick={handleAuthorize}
        disabled={authorized}
      >
        {authorized ? "✓ Spotify Authorized" : "Authorize Spotify"}
      </button>
      <span class="top"></span>
      <span class="right"></span>
      <span class="bottom"></span>
      <span class="left"></span>
    </header>
  );
};

export default Header;
