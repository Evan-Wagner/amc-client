import logo from './logo.svg';
import './App.css';
import { getBases, getRecords, addRecord } from './utils';
import React, { useState } from 'react';

function App() {

  const [recordsJson, setRecords] = useState(null);

  const doRecords = async (airtableApiKey) => {
    const baseId = 'appkuUbZ5RipsMM6I';
    const tableId = 'tbl53wHMzfQksGi3c';

    const recordsJson = await getRecords(airtableApiKey, baseId, tableId);
    // const recordsJson = await getBases(airtableApiKey);
    setRecords(recordsJson);
  }

  class ApiKeyForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {    this.setState({value: event.target.value});  }
    handleSubmit(event) {
      // alert('A key was submitted: ' + this.state.value);
      doRecords(this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>        <label>
            Airtable API key:
            <input type="text" value={this.state.value} onChange={this.handleChange} />        </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

  // const msg = recordsJson ? JSON.stringify(recordsJson,null,2) : 'null';

  class RecordsTable extends React.Component {
    render() {
      return (
        <table>
          <tr>
            <th>Name</th>
            <th>Link</th>
          </tr>
          {recordsJson ? recordsJson.records.map(record => {
            return (
              <tr>
                <th>{record.fields.Name}</th>
                <th><a href={record.fields.URL} target="_blank">{record.fields.Platform}</a></th>
              </tr>
            )
          }) : null}
        </table>
      )
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          {/* Airtable API key: {airtableApiKey} */}
        </p>
        <ApiKeyForm />
      </header>
      <body>
        <RecordsTable />
      </body>
    </div>
  );
}

export default App;
