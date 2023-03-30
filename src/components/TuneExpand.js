import React from 'react';

const TuneExpand = ({ record, handleEdit, handleDelete, handleCollapse}) => {
  const endorsements = record.endorsements.map(str => str.charAt(0).toUpperCase() + str.slice(1,2));
  
  return (
    <div className="tune-row tune-row-expand" >
      <div className="tune-cell tune-details-expand">
        <h3>{record.name}</h3>
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
            <br />
        </React.Fragment>
        ))}
        <div className="tune-cell tune-endorsements">
          {endorsements.map((str, index) => (
            <div className="circle" key={index}>
              {str}
            </div>
          ))}
        </div>
      </div>
      <div className="tune-cell tune-description-expand">
        {record.description}
      </div>
      <div className="tune-cell tune-actions">
        <div>
          <button onClick={() => handleEdit(record._id)}>Edit</button>
          <button onClick={() => handleDelete(record._id)}>Delete</button>
          <button onClick={() => handleCollapse(record._id)}>Collapse</button>
        </div>
      </div>
    </div>
  );
};

export default TuneExpand;
