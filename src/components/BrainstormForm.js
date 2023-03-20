import React from 'react';
import { parseStreamingSource } from '../streamingUtils';

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

export default AddToBrainstormForm;
