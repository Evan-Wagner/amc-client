import React, { useEffect, useState } from 'react';
import env from 'react-dotenv';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css';
import '../styles/themes.css';

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

const Header = ({ token, setToken, theme, setTheme }) => {
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

  const [themeNames, setThemeNames] = useState([]);

  useEffect(() => {
    const cssRules = document.styleSheets[0].cssRules;
    const array = Array.from(cssRules);
    const themeRules = array.filter(rule => rule.selectorText && rule.selectorText.startsWith('.theme-'));
    const themes = themeRules.map(rule => rule.selectorText.substring('.theme-'.length));

    setThemeNames(themes);
  }, [])

  const authorized = Boolean(token);

  const handleAuthorize = () => {
    const currentPath = window.location.pathname;
    window.localStorage.setItem('previousPath', currentPath);
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${env.SPOTIFY_CLIENT_ID}&redirect_uri=${redirect_uri}/spotify-callback&response_type=token&scope=user-top-read user-read-currently-playing`;
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  return (
    <header className={`App-header`}>
      <Navigation />
      <div className="theme-dropdown">
        <select value={theme} onChange={handleThemeChange}>
        {themeNames.map(themeName => (
            <option key={themeName} value={`theme-${themeName}`}>{themeName}</option>
          ))}
        </select>
      </div>
      <h1>Async Music Collab</h1>
      <button
        className={authorized ? "authorize-button authorized" : "authorize-button"}
        onClick={handleAuthorize}
        disabled={authorized}
      >
        {authorized ? "✓ Spotify Authorized" : "Authorize Spotify"}
      </button>
      <span className="top"></span>
      <span className="right"></span>
      <span className="bottom"></span>
      <span className="left"></span>
    </header>
  );
};

export default Header;
