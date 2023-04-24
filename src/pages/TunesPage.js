import React, { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import TuneTable from '../components/TuneTable';

import {
  getAllLists,
  insertList
} from '../apis/lists-api';

const AddListForm = ({ onCreateList }) => {
  const [listName, setListName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (listName.trim() === '') return;
    const insertResponse = await insertList({"name": listName});
    // console.log("response:",insertResponse);
    onCreateList({
      "name": listName,
      "_id": insertResponse.data.id
    });
    setListName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="List name"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <button type="submit">Create List</button>
    </form>
  );
};

const TunesPage = ({ token }) => {
  const [lists, setLists] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const fetchLists = async () => {
    try {
      const response = await getAllLists();
      setLists(response.data);
    } catch (error) {
      console.error("Error fetching lists:", error.message);
      setLists(null);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = (newList) => {
    setLists([...lists, newList]);
    setActiveTab(newList.name);
  };

  const handleDeleteList = () => {
    fetchLists();
    setActiveTab(null);
  }

  const handleTabClick = (label) => {
    setActiveTab(label);
  };

  return (
    <>
      {lists ? (
        <Tabs
          activeTab={activeTab}
          onClickTabItem={handleTabClick}
          childrenArray={[
            ...lists.map((list) => (
              <div label={list.name} key={list._id}>
                <TuneTable listId={list._id} token={token} onDeleteList={handleDeleteList}/>
              </div>
            )),
            <div label="+" key="addList">
              <AddListForm onCreateList={handleCreateList} />
            </div>,
          ]}
        ></Tabs>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default TunesPage;
