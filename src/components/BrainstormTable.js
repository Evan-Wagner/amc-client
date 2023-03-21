import React from 'react';

const BrainstormTable = ({ brainstormJson }) => {
  return (
    brainstormJson && (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Links</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {brainstormJson.map((record) => (
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
                    {index !== record.streamingUrls.length - 1 && <span className="dot"> • </span>}
                  </React.Fragment>
                ))}
              </td>
              <td>{record.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
};

export default BrainstormTable;
