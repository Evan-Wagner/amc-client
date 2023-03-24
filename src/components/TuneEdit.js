import React, { useState } from 'react';

const TuneEdit = ({ record, handleSave, handleDelete, handleCollapse }) => {
  const [name, setName] = useState(record.name);
  const [urls, setUrls] = useState(record.streamingUrls);
  const [description, setDescription] = useState(record.description);

  const handleUrlChange = (index, event) => {
    const updatedUrls = urls.map((url, i) => (i === index ? event.target.value : url));
    setUrls(updatedUrls);
  };

  const handleSaveClick = () => {
    handleSave({ ...record, name, streamingUrls: urls, description: description });
  };

  return (
    <div className="tune-row-expand">
      <div className="tune-cell tune-details">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br />
        {urls.map((url, index) => (
          <React.Fragment key={index}>
            <input
              type="text"
              value={url}
              onChange={(event) => handleUrlChange(index, event)}
            />
            <br />
          </React.Fragment>
        ))}
      </div>
      <div className="tune-divider" />
      <div className="tune-cell tune-description-expand">
        <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            />
      </div>
      <div className="tune-divider" />
      <div className="tune-cell tune-actions">
        <button onClick={handleSaveClick}>Save</button>
        <button onClick={() => handleDelete(record._id)}>Delete</button>
        <button onClick={() => handleCollapse(record._id)}>Collapse</button>
      </div>
    </div>
  );
};

export default TuneEdit;