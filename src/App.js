import env from 'react-dotenv';

import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Tabs from './components/Tabs';
import { getBases, getRecords, addRecords } from './airtableUtils';
import { getTrack, getCurrentTrack, parseTrackIdFromSpotifyUrl } from './spotifyUtils';

const baseId = 'appkuUbZ5RipsMM6I';
const longlistTableId = 'tbl53wHMzfQksGi3c';

const redirect_uri = env.REACT_ENV === 'dev' ? 'http://localhost:3000' : 'https://async-music-collab.vercel.app/';

function App() {

  const [token, setToken] = useState("");

  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // cache token
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    // let expired = window.localStorage.getItem("expired");

    if (hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);

    // uncomment these out to test permission error messages
    // setNotAllowed("not_allowed")
    // setExpired("expired")
  }, [])

  const [longlistJson, setLonglist] = useState(null);

  const [devMsg, setDevMsg] = useState(null);

  const loadLonglistRecords = async () => {
    const recordsJson = await getRecords(baseId, longlistTableId);
    setLonglist(recordsJson);
  }

  const addTrackFromSpotifyUrl = async (url) => {
    const trackId = url ? parseTrackIdFromSpotifyUrl(url) : null;

    const json = trackId ? await getTrack(trackId, token) : null;

    const response = json ? await addRecords(baseId, longlistTableId, [{
      'title': json.name,
      'spotifyUrl': url
    }]) : null;

    return response;
  }

  const addTrackFromCurrent = async () => {
    const json = await getCurrentTrack(token);

    const response = json ? await addRecords(baseId, longlistTableId, [{
      'title': json.item.name,
      'spotifyUrl': json.item.external_urls.spotify
    }]) : null;

    return response;
  }

  class AddToLonglistForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {trackTitle: '', spotifyUrl: '', youtubeUrl: '', responseMsg: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
    
    async handleSubmit(event) {
      event.preventDefault();

      this.setState({
        responseMsg: 'Loading...',
      });

      if (token == '') {
        this.setState({
          responseMsg: 'Please authenticate Spotify.'
        });
      } else if (this.state.spotifyUrl != '') {
        try {
          await addTrackFromSpotifyUrl(this.state.spotifyUrl);
          await loadLonglistRecords();
          this.setState({
            responseMsg: 'Track added successfully.'
          });
        } catch (err) {
          this.setState({
            responseMsg: ''+err.toString()
          });
        }
      } else if (this.state.youtubeUrl != '') {
        this.setState({
          responseMsg: 'Youtube functionality pending.'
        });
      } else {
        this.setState({
          responseMsg: 'Please include at least one link.'
        });
      }
    }

    async handleSubmitCurrent(event) {
      event.preventDefault();

      // this.setState({
      //   responseMsg: 'Loading...',
      // });

      if (token == '') {
        this.setState({
          responseMsg: 'Please authenticate Spotify.'
        });
      } else {
        try {
          await addTrackFromCurrent();
          await loadLonglistRecords();
          this.setState({
            responseMsg: 'Track added successfully!'
          });
        } catch (err) {
          this.setState({
            responseMsg: ''+err.toString()
          });
        }
      }
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <h3>Add to Longlist</h3> {this.state.responseMsg}<br />
          <input type="button" name="fromCurrent" value="Get currently playing Spotify track" onClick={this.handleSubmitCurrent}/><br />
          <label>Or paste Spotify link: </label><input type="text" name="spotifyUrl" value={this.state.spotifyUrl} onChange={this.handleChange} /><br />
          <label>and/or Youtube link: </label><input type="text" name="youtubeUrl" value={this.state.youtubeUrl} onChange={this.handleChange} /><br />
          <input type="submit" name="fromUrl" value="Submit" />
        </form>
      );
    }
  }

  class ShowLonglistButton extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
      event.preventDefault();
      loadLonglistRecords();
    }

    render() {
      return !longlistJson && (
        <form onSubmit={this.handleSubmit}>
          <input type="submit" value="Show Longlist" />
        </form>
      )
    }
  }

  class LonglistTable extends React.Component {
    render() {
      return longlistJson && (
        <table>
          <tr>
            <th>Title</th>
            <th>Links</th>
            <th>Notes</th>
          </tr>
          {longlistJson ? longlistJson.records.map(record => {
            return (
              <tr>
                <td>{record.fields.title}</td>
                <td><a href={record.fields.spotifyUrl} target="_blank" rel="noreferrer">Spotify</a> • <a href={record.fields.youtubeUrl} target="_blank" rel="noreferrer">Youtube</a> • <a href={record.fields.appleUrl} target="_blank" rel="noreferrer">Apple</a> • <a href={record.fields.otherUrl} target="_blank" rel="noreferrer">Other</a></td>
                <td>{record.fields.notes}</td>
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
        <h1>Async Music Collab</h1>
        <a href={`https://accounts.spotify.com/authorize?client_id=${env.SPOTIFY_CLIENT_ID}&redirect_uri=${env.SPOTIFY_RED_URI}&response_type=token&scope=user-top-read user-read-currently-playing`}>Authorize Spotify</a>
        {/* Dev message: {devMsg} <br /> */}
        {/* Spotify token: {token} <br /> */}
      </header>
      <body>
        <Tabs>
          <div label="Longlist">
          <AddToLonglistForm />
          <ShowLonglistButton />
          <LonglistTable />
          </div>
          <div label="Shortlist">
            TBD
          </div>
          <div label="Setlists">
            TBD
          </div>
          <div label="Scheduling">
            TBD
          </div>
        </Tabs>
        
      </body>
    </div>
  );
}

export default App;
