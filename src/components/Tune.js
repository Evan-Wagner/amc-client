import React from 'react';

const Tune = ({ record, handleEdit, handleDelete, handleExpand }) => {
  // Capitalize the first letter of each endorsement
  const endorsements = record.endorsements.map(str => str.charAt(0).toUpperCase() + str.slice(1,2));
  
  return (
    <div className="tune-row">
      <div className="tune-cell tune-name" title={record.name}>
        {record.name}
      </div>
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
      <div className="tune-cell tune-description">{record.description}</div>
      <div className="tune-cell tune-endorsements">
          {endorsements.map((str, index) => (
            <div className="circle" key={index}>
              {str}
            </div>
          ))}
      </div>
      <div className="tune-cell tune-actions">
        <div>
          <button onClick={() => handleEdit(record._id)}>Edit</button>
          <button onClick={() => handleDelete(record._id)}>Delete</button>
          <button onClick={() => handleExpand(record._id)}>Expand</button>
        </div>
      </div>
    </div>
  );
};

export default Tune;
