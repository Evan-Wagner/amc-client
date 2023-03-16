import React, { useState, useEffect } from 'react';
import env from 'react-dotenv';

import './App.css';
import Tabs from './components/Tabs';
import {
  parseStreamingSource,
  getSpotifyTrack,
  getSpotifyCurrentTrack,
  parseSpotifyTrackIdFromUrl
} from './streamingUtils';
import {
  insertTune,
  getAllTunes,
  updateTuneById,
  deleteTuneById,
  getTuneById
} from './apis/tune-api';

const redirect_uri = env.REACT_ENV === 'dev' ? `http://localhost:${env.PORT}/` : 'https://async-music-collab.vercel.app/';

function App() {

  const [token, setToken] = useState("");

  const [expired, setExpired] = useState(false);

  // handle login
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

  const [brainstormJson, setBrainstorm] = useState(null);

  const loadBrainstormTunes = async () => {
    const tunes = await getAllTunes();
    setBrainstorm(tunes.data);
  };

  const addTune = async (name, streamingUrls) => {
    const parsedUrls = streamingUrls.map((url) => [url, parseStreamingSource(url)]);
    await insertTune({ name, streamingUrls: parsedUrls, endorsements: [] });
    loadBrainstormTunes();
  };


  const addTrackFromSpotifyUrl = async (url) => {
    const trackId = url ? parseSpotifyTrackIdFromUrl(url) : null;
    const json = trackId ? await getSpotifyTrack(trackId, token) : null;

    if (json) {
      await addTune(json.name, [url]);
    }
  };

  const addTrackFromCurrent = async () => {
    const json = await getSpotifyCurrentTrack(token);

    if (json) {
      await addTune(json.item.name, [json.item.external_urls.spotify]);
    }
  };

  class AddToBrainstormForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '', spotifyUrl: '', youtubeUrl: '', responseMsg: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleSubmitCurrent = this.handleSubmitCurrent.bind(this);
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

      if (token === '') {
        this.setState({
          responseMsg: 'Please authenticate Spotify.'
        });
      } else if (this.state.spotifyUrl !== '') {
        try {
          await addTrackFromSpotifyUrl(this.state.spotifyUrl);
          await loadBrainstormTunes();
          this.setState({
            responseMsg: 'Track added successfully.'
          });
        } catch (err) {
          this.setState({
            responseMsg: ''+err.toString()
          });
        }
      } else if (this.state.youtubeUrl !== '') {
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

      if (token === '') {
        this.setState({
          responseMsg: 'Please authenticate Spotify.'
        });
      } else {
        try {
          await addTrackFromCurrent();
          await loadBrainstormTunes();
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
          <h3>Add to Brainstorm</h3> {this.state.responseMsg}<br />
          <input type="button" name="fromCurrent" value="Get currently playing Spotify track" onClick={this.handleSubmitCurrent}/><br />
          <label>Or paste Spotify link: </label><input type="text" name="spotifyUrl" value={this.state.spotifyUrl} onChange={this.handleChange} /><br />
          <label>and/or Youtube link: </label><input type="text" name="youtubeUrl" value={this.state.youtubeUrl} onChange={this.handleChange} /><br />
          <input type="submit" name="fromUrl" value="Submit" />
        </form>
      );
    }
  }

  class ShowBrainstormButton extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
      event.preventDefault();
      loadBrainstormTunes();
    }

    render() {
      return !brainstormJson && (
        <form onSubmit={this.handleSubmit}>
          <input type="submit" value="Show Brainstorm" />
        </form>
      )
    }
  }

  class BrainstormTable extends React.Component {
    render() {
      return brainstormJson && (
        <table>
          <tr>
            <th>Name</th>
            <th>Links</th>
            <th>Notes</th>
          </tr>
          {brainstormJson ? brainstormJson.map(record => {
            return (
              <tr>
                <td>{record.name}</td>
                <td>
                  {record.streamingUrls.map((urlTuple, index) => (
                    <React.Fragment key={index}>
                      <a
                        key={index}
                        className="streaming-link"
                        href={urlTuple[0]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {urlTuple[1]}
                      </a>
                      {index !== record.streamingUrls.length - 1 && (
                        <span className="dot"> • </span>
                      )}
                    </React.Fragment>
                  ))}
                </td>
                <td>{record.notes}</td>
              </tr>
            );
          }) : null}
        </table>
      );
    }
  }
  
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Async Music Collab</h1>
        <a href={`https://accounts.spotify.com/authorize?client_id=${env.SPOTIFY_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=token&scope=user-top-read user-read-currently-playing`}>Authorize Spotify</a>
        {/* Dev message: {devMsg} <br /> */}
        {/* Spotify token: {token} <br /> */}
      </header>
        <Tabs>
          <div label="Brainstorm">
          <AddToBrainstormForm />
          <ShowBrainstormButton />
          <BrainstormTable />
          </div>
          <div label="Shortlist">
            TBD
          </div>
          <div label="Repertoire">
            TBD
          </div>
          <div label="Setlists">
            TBD
          </div>
          <div label="Scheduling">
            TBD
          </div>
          <div label="Settle Up">
            TBD
          </div>
        </Tabs>
    </div>
  );
}

export default App;
