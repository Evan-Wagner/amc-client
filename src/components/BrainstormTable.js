import React, { useState } from 'react';
import Tune from './Tune';
import TuneExpand from './TuneExpand';
import TuneEdit from './TuneEdit';
import { updateTuneById, deleteTuneById } from '../apis/tunes-api';

const BrainstormTable = ({ brainstormJson, loadBrainstormTunes }) => {
  const [expandedTuneId, setExpandedTuneId] = useState(null);
  const [editingTuneId, setEditingTuneId] = useState(null);

  const handleEdit = (id) => {
    setEditingTuneId(id);
  };

  const handleSave = async (updatedRecord) => {
    await updateTuneById(updatedRecord._id, updatedRecord);
    loadBrainstormTunes();
    setEditingTuneId(null);
  };

  const handleDelete = async (id) => {
    await deleteTuneById(id);
    loadBrainstormTunes();
  };

  const handleExpand = (id) => {
    setExpandedTuneId(expandedTuneId === id ? null : id);
  };

  return (
    brainstormJson && (
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
                handleCollapse={() => handleExpand(record._id)}
              />
            );
          } else if (isExpanded) {
            return (
              <TuneExpand
                key={record._id}
                record={record}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCollapse={() => handleExpand(record._id)}
              />
            );
          } else {
            return (
              <Tune
                key={record._id}
                record={record}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleExpand={() => handleExpand(record._id)}
              />
            );
          }
        })}
      </div>
    )
  );
}

export default BrainstormTable;