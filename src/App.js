import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/App.css';

import Pages from './pages';

import Header from './components/Header';

function App() {
  const [token, setToken] = useState("");

  const [theme, setTheme] = useState("theme-spotify-purple");


  return (
    <Router>
      <div className={`App ${theme}`}>
        <Header
          token={token} setToken={setToken}
          theme={theme} setTheme={setTheme}
        />
        <Pages token={token} />
      </div>
    </Router>
  );
}

export default App;