import React, { useState, useEffect } from 'react';

import Tabs from '../components/Tabs';

import {
  parseStreamingSource,
  getSpotifyTrack,
  getSpotifyCurrentTrack,
  parseSpotifyTrackIdFromUrl
} from '../streamingUtils';
import {
  insertTune,
  getAllTunes,
  updateTuneById,
  deleteTuneById,
  getTuneById
} from '../apis/tunes-api';

const TunesPage = ({ token }) => {
  const [brainstormJson, setBrainstorm] = useState(null);

  const loadBrainstormTunes = async () => {
    const tunes = await getAllTunes();
    setBrainstorm(tunes.data);
  };
  
  useEffect(() => {
    if (brainstormJson === null) {loadBrainstormTunes();}
  }, []);

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

  class BrainstormForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '', spotifyUrl: '', youtubeUrl: '', responseMsg: ''};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  
    async handleTrackSubmission(callback) {
      this.setState({ responseMsg: 'Loading...' });
      if (token === '') {
        this.setState({ responseMsg: 'Please authenticate Spotify.' });
      } else {
        try {
          await callback();
          await loadBrainstormTunes();
          this.setState({ responseMsg: 'Track added successfully!' });
        } catch (err) {
          this.setState({ responseMsg: '' + err.toString() });
        }
      }
    }
  
    handleSubmit(event) {
      event.preventDefault();
      if (this.state.spotifyUrl !== '') {
        this.handleTrackSubmission(() => addTrackFromSpotifyUrl(this.state.spotifyUrl));
      } else if (this.state.youtubeUrl !== '') {
        this.setState({ responseMsg: 'Youtube functionality pending.' });
      } else {
        this.setState({ responseMsg: 'Please include at least one link.' });
      }
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <h3>Add to Brainstorm</h3> {this.state.responseMsg}<br />
          <input type="button" name="fromCurrent" value="Get currently playing Spotify track" onClick={() => this.handleTrackSubmission(addTrackFromCurrent)} /><br />
          <label>Or paste Spotify link: </label><input type="text" name="spotifyUrl" value={this.state.spotifyUrl} onChange={this.handleChange} /><br />
          <label>and/or Youtube link: </label><input type="text" name="youtubeUrl" value={this.state.youtubeUrl} onChange={this.handleChange} /><br />
          <input type="submit" name="fromUrl" value="Submit" />
        </form>
      );
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
    <Tabs>
      <div label="Brainstorm">
        <BrainstormForm />
        <BrainstormTable />
      </div>
      <div label="Shortlist">TBD</div>
      <div label="Repertoire">TBD</div>
      <div label="Setlists">TBD</div>
      <div label="Scheduling">TBD</div>
      <div label="Settle Up">TBD</div>
    </Tabs>
  );
};

export default TunesPage;
