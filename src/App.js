import logo from './logo.svg';
import './App.css';
import { getRecords, addRecord } from './utils';

function App() {
  console.log(process.env.AIRTABLE_API_KEY);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          4 big guys
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
