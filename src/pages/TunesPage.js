import React, { useState, useEffect } from 'react';

import Tabs from '../components/Tabs';
import BrainstormTable from '../components/BrainstormTable';

import { getAllTunes, insertTune, updateTuneById, deleteTuneById } from '../apis/tunes-api';

const TunesPage = ({ token }) => {

  return (
    <Tabs>
      <div label="Brainstorm">
        <BrainstormTable
          token={token}
        />
      </div>
      <div label="Shortlist">TBD</div>
      <div label="Repertoire">TBD</div>
      <div label="Setlists">TBD</div>
    </Tabs>
  );
};

export default TunesPage;
