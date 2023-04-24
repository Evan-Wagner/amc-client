import React, { useState } from 'react';

import { getSpotifyCurrentTrack, parseStreamingSource } from '../streamingUtils';

const TuneEdit = ({ record, handleSave, handleDelete, handleCollapse, token }) => {
  const recordId = record ? record._id : null;
  const [name, setName] = useState(record ? record.name : "");
  const [tracks, setTracks] = useState(record ? record.tracks : []);
  const [description, setDescription] = useState(record ? record.description : "");
  const [saveMsg, setSaveMsg] = useState("");

  const handleTrackChange = (index, event) => {
    const updatedTracks = tracks.map((track, i) => (i === index ? ({
      'url': event.target.value,
      'source': parseStreamingSource(event.target.value)
     }) : track));
    setTracks(updatedTracks);
  };

  const addUrlInput = () => {
    if (tracks.length < 6) {
      setTracks([...tracks, {}]);
    }
  };
  
  const removeUrlInput = (index) => {
    const newUrls = tracks.filter((_, i) => i !== index);
    setTracks(newUrls);
  };

const addSpotifyCurrentTrack = async () => {
    if (token === '') {
      setSaveMsg('Please authenticate Spotify.');
    } else {
      try {
        const track = await getSpotifyCurrentTrack(token);
        if (track) {
          setTracks([...tracks, track]);
          if (name === "") {
            setName(track.title);
          }
        }
      } catch (err) {
        setSaveMsg(""+err);
      }
    }
  };

  const handleSaveClick = () => {
    handleSave({ ...record, name: name, tracks: tracks.filter(track => track.url !== ""), description: description })
      .then(() => {
        setSaveMsg('Tune saved successfully.');
      })
      .catch((err) => {
        setSaveMsg(err.message);
      });
  };

  return (
    <div className="tune-row tune-row-expand">
      <div className="tune-cell tune-details-edit">
        Name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div />
        Track Link(s)
        {tracks.map((url, index) => (
          <React.Fragment>
            {index > 0 ? <div /> : null}
            <input
              type="text"
              value={url.url}
              onChange={(event) => handleTrackChange(index, event)}
            />
            <input
              type="button"
              className="button-primary remove-url-button"
              value="-"
              onClick={() => removeUrlInput(index)}
            />
          </React.Fragment>
        ))}
        {tracks.length === 0 ? null : <div />}
        {tracks.length < 6 ? <input
          type="button"
          className="button-primary add-url-button"
          value={tracks.length === 0 ? 'Paste track link(s)' : '+'}
          onClick={addUrlInput}
        /> : ''}
      </div>
      <div className="tune-cell tune-description-expand">
        <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            />
      </div>
      <div className="tune-cell tune-actions">
        <div>
          <button onClick={handleSaveClick}>Save</button>
          {recordId ? <button onClick={() => handleDelete(recordId)}>Delete</button> : null}
          <button onClick={() => handleCollapse(recordId)}>Collapse</button>
        </div>
        <input
          type="button"
          className="add-spotify-current-button"
          name="fromCurrent"
          value="Get current track"
          onClick={addSpotifyCurrentTrack}
        />
        <p>{saveMsg}</p>
      </div>
    </div>
  );
};

export default TuneEdit;