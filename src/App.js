import env from 'react-dotenv';

import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { getBases, getRecords, addRecords } from './airtableUtils';
import { getTrack, parseTrackIdFromSpotifyUrl } from './spotifyUtils';

const baseId = 'appkuUbZ5RipsMM6I';
const longlistTableId = 'tbl53wHMzfQksGi3c';

function App() {

  const [token, setToken] = useState("");

  const [expired, setExpired] = useState(false);

  const addTrackFromSpotifyUrl = async (url) => {
    const trackId = parseTrackIdFromSpotifyUrl(url);

    const json = await getTrack(trackId, token);

    const response = await addRecords(baseId, longlistTableId, {
      'title': json.name,
      'spotifyUrl': url
    });

    return response;
  }

  useEffect(() => {
    // cache token
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if ((!token | expired) && hash) {
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

  const [spotifyAuthorized, setSpotifyAuthorized] = useState(null);

  const loadLonglistRecords = async () => {
    const recordsJson = await getRecords(baseId, longlistTableId);
    setLonglist(recordsJson);
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
    
    handleSubmit(event) {
      this.setState({
        responseMsg: 'Loading...',
      });

      if (token == '') {
        this.setState({
          responseMsg: 'Please authenticate Spotify.'
        });
      } else if (expired) {
        this.setState({
          responseMsg: 'Token expired, please authenticate again.'
        });
      } else if (this.state.spotifyUrl != '') {
        addTrackFromSpotifyUrl(this.state.spotifyUrl).then((response) => {
          this.setState({
            responseMsg: 'Track added successfully!'
          });
        }).catch((err) => {
          if (err.response.status === 401) {
            setExpired(true);
          }
          this.setState({
            responseMsg: ''+err.toString()
          });
        })
      } else if (this.state.youtubeUrl != '') {
        this.setState({
          responseMsg: 'Youtube functionality pending.'
        });
      } else {
        this.setState({
          responseMsg: 'Please include at least one link.'
        });
      }

      // loadLonglistRecords();
    
      event.preventDefault();
    }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          {this.state.responseMsg} <br />
          Add to Longlist <br />
          Spotify link: <input type="text" name="spotifyUrl" value={this.state.spotifyUrl} onChange={this.handleChange} /><br />
          and/or Youtube link: <input type="text" name="youtubeUrl" value={this.state.youtubeUrl} onChange={this.handleChange} /><br />
          <input type="submit" value="Submit" />
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
      loadLonglistRecords();
      event.preventDefault();
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
          </tr>
          {longlistJson ? longlistJson.records.map(record => {
            return (
              <tr>
                <th>{record.fields.title}</th>
                <th><a href={record.fields.spotifyUrl} target="_blank" rel="noreferrer">Spotify</a> • <a href={record.fields.youtubeUrl} target="_blank" rel="noreferrer">Youtube</a></th>
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
        <a href={`https://accounts.spotify.com/authorize?client_id=${env.SPOTIFY_CLIENT_ID}&redirect_uri=${env.SPOTIFY_RED_URI}&response_type=token&scope=user-top-read`}>Authorize Spotify</a>
        Dev message: {devMsg} <br />
        Spotify token: {token} <br />
      </header>
      <body>
        <AddToLonglistForm />
        <ShowLonglistButton />
        <LonglistTable />
      </body>
    </div>
  );
}

export default App;
