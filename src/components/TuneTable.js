import React, { useState, useEffect } from 'react';
import TuneCompact from './TuneCompact';
import TuneExpand from './TuneExpand';
import TuneEdit from './TuneEdit';

import {
  getAllTunes,
  insertTune,
  updateTuneById,
  deleteTuneById,
} from '../apis/tunes-api';
import {
  getAllTracks,
  getTrackById,
  insertTrack,
} from '../apis/tracks-api';
import {
  deleteListById
} from '../apis/lists-api';
import {
  getSpotifyTrack,
  parseSpotifyTrackIdFromUrl,
} from '../streamingUtils';

const TuneTable = ({ listId, onDeleteList, token }) => {
  const [tunesJson, setTunes] = useState(null);

  const loadTunes = async () => {
    const response = await getAllTunes();
    const tunes = response.data || null;
    const filteredTunes = tunes.filter((tune) =>
      tune.lists.includes(listId)
    );
    for (var i in filteredTunes) {
      for (var j in filteredTunes[i].tracks) {
        try {
          const response = await getTrackById(filteredTunes[i].tracks[j]);
          if (response.error) {
            throw new Error(JSON.stringify(response.error.message));
          } else {
            filteredTunes[i].tracks[j] = response.data.data;
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }
    setTunes(filteredTunes);
  };

  useEffect(() => {
    if (tunesJson === null) {
      loadTunes();
    }
  }, []);

  const [expandedTuneId, setExpandedTuneId] = useState(null);
  const [editingTuneId, setEditingTuneId] = useState(null);
  
  const handleEdit = (id) => {
    setEditingTuneId(id);
    setExpandedTuneId(id);
  };

  const handleDelete = async (id, isList) => {
    if (window.confirm(`Are you sure you want to delete this ${isList ? "list" : "tune"}?`)) {
      if (isList) {
        await deleteListById(id);
        if (onDeleteList) {
          onDeleteList(id);
        }
      } else {
        await deleteTuneById(id);
        loadTunes();
      }
    }
  };

  const handleSave = async (record) => {
    const throwError = (message) => { throw new Error(message); };
  
    // Fetch all tracks from the database
    const allTracksResponse = await getAllTracks();
    const allTracks = allTracksResponse.data;
  
    for (const [index, track] of record.tracks.entries()) {
      if (!track._id) {
        if (track.title === "" && track.source === "spotify") {
          const spotifyTrack = await getSpotifyTrack(parseSpotifyTrackIdFromUrl(track.url)).catch(throwError);
          if (!spotifyTrack) throwError(JSON.stringify(spotifyTrack.message));
          track = { ...track, ...spotifyTrack };
        }
  
        // Check if the user-submitted URL already exists in the database
        const existingTrack = allTracks.find(t => t.url === track.url);
  
        if (existingTrack) {
          // If the URL already exists, use the existing track ID
          record.tracks[index] = existingTrack._id;
        } else {
          // If the URL does not exist, insert a new track and use its ID
          const insertResponse = await insertTrack(track).catch(throwError);
          if (!insertResponse.data.success) throwError(JSON.stringify(insertResponse.message));
          record.tracks[index] = insertResponse.data.id;
        }
      }
    }
  
    if (!record.lists) {
      record.lists = [];
    }

    if (!record.lists.includes(listId)) {
      record.lists.push(listId);
    }

    const updateResponse = record._id
      ? await updateTuneById(record._id, record)
      : await insertTune(record);
    if (!updateResponse.data.success)
      throwError(JSON.stringify(updateResponse.message));

    loadTunes();
    setEditingTuneId(null);
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
      <button onClick={() => handleEdit("new")}>Add tune</button>
      <button onClick={() => handleDelete(listId,true)}>Delete list</button>
      </div>
    </div>
  );

  return (
    tunesJson && (
      <React.Fragment>
        {editingTuneId === "new" ?
          <TuneEdit
            record={null}
            handleSave={handleSave}
            handleDelete={() => handleExpandCollapse(null)}
            handleCollapse={() => handleExpandCollapse(null)}
            token={token}
          /> : <UtilityBar />}
        <div className="tune-table">
          {tunesJson ? tunesJson.map((record) => {
            const isExpanded = record._id === expandedTuneId;
            const isEditing = record._id === editingTuneId;

            if (isEditing) {
              return (
                <TuneEdit
                  key={record._id}
                  record={record}
                  handleSave={handleSave}
                  handleDelete={() => handleDelete(record._id, false)}
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
          }) : null}
        </div>
      </React.Fragment>
    )
  );
}

export default TuneTable;