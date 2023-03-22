import React, { useState, useEffect } from 'react';

import Tabs from '../components/Tabs';
import BrainstormForm from '../components/BrainstormForm';
import BrainstormTable from '../components/BrainstormTable';

import {
  getAllTunes
} from '../apis/tunes-api';

const TunesPage = ({ token }) => {
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

  return (
    <Tabs>
      <div label="Brainstorm">
        <BrainstormForm
          token={token}
          loadBrainstormTunes={loadBrainstormTunes}
        />
        <BrainstormTable
          brainstormJson={brainstormJson}
          loadBrainstormTunes={loadBrainstormTunes}
        />
      </div>
      <div label="Shortlist">TBD</div>
      <div label="Repertoire">TBD</div>
      <div label="Setlists">TBD</div>
    </Tabs>
  );
};

export default TunesPage;
