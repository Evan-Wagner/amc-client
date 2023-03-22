import React, { useState } from 'react';
import { parseStreamingSource, getSpotifyTrack, getSpotifyCurrentTrack, parseSpotifyTrackIdFromUrl } from '../streamingUtils';
import { insertTune } from '../apis/tunes-api';

const BrainstormForm = ({ token, loadBrainstormTunes }) => {
  const [state, setState] = useState({
    name: '',
    urls: [],
    responseMsg: '',
  });

  const handleChange = (event, index) => {
    const newUrls = [...state.urls];
    newUrls[index] = event.target.value;
    setState({ ...state, urls: newUrls });
  };

  const addUrlInput = () => {
    if (state.urls.length < 6) {
      setState({ ...state, urls: [...state.urls, ''] });
    }
  };
  
  const removeUrlInput = (index) => {
    const newUrls = state.urls.filter((_, i) => i !== index);
    setState({ ...state, urls: newUrls });
  };

  const addTuneFromSpotifyCurrent = async () => {
    console.log('token',token);
    if (token == '') {
      setState({ ...state, responseMsg: 'Please authenticate Spotify.'});
    } else {
      try {
        const json = await getSpotifyCurrentTrack(token);

        if (json) {
          const parsedUrls = [[json.item.external_urls.spotify, 'spotify']];
            await insertTune({ name: json.item.name, streamingUrls: parsedUrls, endorsements: [] });
            loadBrainstormTunes();
        }
      } catch (err) {
        setState({ ...state, responseMsg: '' + err.toString() });
      }
    }
  };

  const addTuneFromUrls = async (urls) => {
    const spotifyUrls = urls.filter((url) => parseStreamingSource(url) === 'spotify');
    if (spotifyUrls.length > 0) {
      const trackId = parseSpotifyTrackIdFromUrl(spotifyUrls[0]);
      const json = trackId ? await getSpotifyTrack(trackId, token) : null;
      if (json) {
        const parsedUrls = spotifyUrls.map((url) => [url, 'spotify']);
        await insertTune({ name: json.name, streamingUrls: parsedUrls, endorsements: [] });
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validUrls = state.urls.filter((url) => url !== '');
    if (validUrls.length > 0) {
      setState({ ...state, responseMsg: 'Loading...' });
  
      try {
        await addTuneFromUrls(validUrls);
        setState({ ...state, responseMsg: 'Tracks successfully added.'});
      } catch (err) {
        setState({ ...state, responseMsg: '' + err.toString() });
      }
  
      loadBrainstormTunes();
    } else {
      setState({ ...state, responseMsg: 'Please include at least one link.' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-content">
        <span className="responseMsg">{state.responseMsg}</span><br />
        <input
          type="button"
          className="add-spotify-current-button"
          name="fromCurrent"
          value="Get currently playing Spotify track"
          onClick={addTuneFromSpotifyCurrent}
        />
        {state.urls.map((url, index) => (
          <React.Fragment key={index}>
            <input
              type="text"
              name={`url${index}`}
              value={url}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              type="button"
              className="remove-url-button"
              value="-"
              onClick={() => removeUrlInput(index)}
            />
            <br />
          </React.Fragment>
        ))}
        { state.urls.length < 6 ? <input
          type="button"
          className="add-url-button"
          value={state.urls.length === 0 ? 'Paste streaming link(s)' : '+'}
          onClick={addUrlInput}
        /> : ''}
        <br />
        <input type="submit" name="fromUrl" value="Submit" />
      </div>
    </form>
  );
};

export default BrainstormForm;