import React, { useState, useEffect } from 'react';
import TuneCompact from './TuneCompact';
import TuneExpand from './TuneExpand';
import TuneEdit from './TuneEdit';

import { getAllTunes, insertTune, updateTuneById, deleteTuneById } from '../apis/tunes-api';

const BrainstormTable = ({ token }) => {
  const [brainstormJson, setBrainstorm] = useState(null);

  const loadBrainstormTunes = async () => {
    const tunes = await getAllTunes();
    setBrainstorm(tunes.data);
  };

  useEffect(() => {
    if (brainstormJson === null) {
      loadBrainstormTunes();
    }
  }, []);

  const [expandedTuneId, setExpandedTuneId] = useState(null);
  const [editingTuneId, setEditingTuneId] = useState(null);
  
  const handleEdit = (id) => {
    setEditingTuneId(id);
    setExpandedTuneId(id);
  };

  const handleDelete = async (id) => {
    await deleteTuneById(id);
    loadBrainstormTunes();
  };

  const handleSave = async (record) => {
    try {
      const response = record._id ? await updateTuneById(record._id, record) : await insertTune(record);
      if (!response.success && !response.data.success) {
        throw new Error(JSON.stringify(response.message));
      } else {
        loadBrainstormTunes();
        setEditingTuneId(null);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  const handleExpandCollapse = (id) => {
    if (expandedTuneId === (id || "new")) {
      setExpandedTuneId(null);
      setEditingTuneId(null);
    } else {
      setExpandedTuneId(id);
    }
  };

  const UtilityBar = () => (
    <div className="utility-bar">
      <div className="tune-cell search-utility">
        SEARCH
      </div>
      <div className="tune-cell sort-utility">
        SORT
      </div>
      <div className="tune-cell tune-actions">
      <button onClick={() => handleEdit("new")}>Add new</button>
      </div>
    </div>
  );

  return (
    brainstormJson && (
      <React.Fragment>
        {editingTuneId === "new" ?
          <TuneEdit
            record={null}
            handleSave={handleSave}
            handleDelete={handleDelete}
            handleCollapse={() => handleExpandCollapse(null)}
            token={token}
          /> : <UtilityBar />}
        <div className="brainstorm-table">
          {brainstormJson.map((record) => {
            const isExpanded = record._id === expandedTuneId;
            const isEditing = record._id === editingTuneId;

            if (isEditing) {
              return (
                <TuneEdit
                  key={record._id}
                  record={record}
                  handleSave={handleSave}
                  handleDelete={handleDelete}
                  handleCollapse={() => handleExpandCollapse(record._id)}
                  token={token}
                />
              );
            } else if (isExpanded) {
              return (
                <TuneExpand
                  key={record._id}
                  record={record}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleCollapse={() => handleExpandCollapse(record._id)}
                />
              );
            } else {
              return (
                <TuneCompact
                  key={record._id}
                  record={record}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleExpand={() => handleExpandCollapse(record._id)}
                />
              );
            }
          })}
        </div>
      </React.Fragment>
    )
  );
}

export default BrainstormTable;