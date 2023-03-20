import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import Pages from './pages';

import Header from './components/Header';

function App() {
  const [token, setToken] = useState("");

  return (
    <Router>
      <div className="App">
        <Header token={token} setToken={setToken} />
        <Pages token={token} />
      </div>
    </Router>
  );
}

export default App;