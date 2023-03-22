import React from 'react';
import { updateTuneById, deleteTuneById } from '../apis/tunes-api';

const BrainstormTable = ({ brainstormJson, loadBrainstormTunes }) => {
  const handleEdit = async (id) => {
    // Implement the edit functionality here, e.g., opening a modal to edit the record
    // Once the modal is submitted, call updateTuneById with the new data
    // await updateTuneById(id, updatedPayload);
    // loadBrainstormTunes();
  };

  const handleDelete = async (id) => {
    await deleteTuneById(id);
    loadBrainstormTunes();
  };

  return (
    brainstormJson && (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Links</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {brainstormJson.map((record) => (
            <tr key={record._id}>
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
              <td>
                <button onClick={() => handleEdit(record._id)}>Edit</button>
                <button onClick={() => handleDelete(record._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  );
};


export default BrainstormTable;
