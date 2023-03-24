import React from 'react';

const Tune = ({ record, handleEdit, handleDelete, handleExpand }) => (
  <div className="tune-row">
    <div className="tune-cell tune-name" title={record.name}>
      {record.name}
    </div>
    <div className="tune-divider" />
    <div className="tune-cell tune-streaming-links">
      {record.streamingUrls.map((urlTuple, index) => (
        <React.Fragment key={index}>
          <a
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
    </div>
    <div className="tune-divider" />
    <div className="tune-cell tune-description">{record.description}</div>
    <div className="tune-divider" />
    <div className="tune-cell tune-endorsements">{record.endorsements}</div>
    <div className="tune-divider" />
    <div className="tune-cell tune-actions">
      <button onClick={() => handleEdit(record._id)}>Edit</button>
      <button onClick={() => handleDelete(record._id)}>Delete</button>
      <button onClick={() => handleExpand(record._id)}>Expand</button>
    </div>
  </div>
);

export default Tune;
