import React, { useState } from 'react';

import { getSpotifyCurrentTrack, parseStreamingSource } from '../streamingUtils';

const TuneEdit = ({ record, handleSave, handleDelete, handleCollapse, token }) => {
  const recordId = record ? record._id : null;
  const [name, setName] = useState(record ? record.name : "");
  const [urls, setUrls] = useState(record ? record.streamingUrls : []);
  const [description, setDescription] = useState(record ? record.description : "");
  const [saveMsg, setSaveMsg] = useState("");

  const handleUrlChange = (index, event) => {
    const updatedUrls = urls.map((url, i) => (i === index ? [event.target.value, parseStreamingSource(event.target.value)] : url));
    setUrls(updatedUrls);
  };

  const addUrlInput = () => {
    if (urls.length < 6) {
      setUrls([...urls, ['','']]);
    }
  };
  
  const removeUrlInput = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const addSpotifyCurrentTrack = async () => {
    if (token === '') {
      setSaveMsg('Please authenticate Spotify.');
    } else {
      try {
        const json = await getSpotifyCurrentTrack(token);
        if (json) {
          setUrls([...urls, [json.item.external_urls.spotify, 'spotify']]);
          setName(json.item.name);
        }
      } catch (err) {
        setSaveMsg(""+err);
      }
    }
  };

  const handleSaveClick = () => {
    handleSave({ ...record, name: name, streamingUrls: urls.filter(url => url[0] !== ""), description: description })
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
        Link(s)
        {urls.map((url, index) => (
          <React.Fragment>
            {index > 0 ? <div /> : null}
            <input
              type="text"
              value={url[0]}
              onChange={(event) => handleUrlChange(index, event)}
            />
            <input
              type="button"
              className="remove-url-button"
              value="-"
              onClick={() => removeUrlInput(index)}
            />
          </React.Fragment>
        ))}
        {urls.length === 0 ? null : <div />}
        {urls.length < 6 ? <input
          type="button"
          className="add-url-button"
          value={urls.length === 0 ? 'Paste streaming link(s)' : '+'}
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