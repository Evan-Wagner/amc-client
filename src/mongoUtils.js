import env from 'react-dotenv';
// import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const getRecords = async (server, database) => {
    const uri = `mongodb+srv://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${server}/${database}`;
    
    mongoose.connect(uri).then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error');
      });;

    // const LongListItem = new Schema({
    //     name: String,
    //     spotifyUrl: String
    // });

    // const LongListModel = mongoose.model('LongList', LongListItem);

    // const longListRecords = await LongListModel.find({});

    // return longListRecords;
}

export const addRecords = async (server, database, data) => {
    return null;
}

// const uri = `mongodb+srv://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@asyncmusiccollab.ur98tcx.mongodb.net/test`;

// const client = new MongoClient(uri);

// exports.run = async () => {
//   try {
//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// };


// exports.getRecords = async (baseId, tableIdOrName) => {
//     const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

//     const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`
//         }
//     });

//     const json = response.ok ? await response.json() : null;
//     return json;
// };

// exports.addRecords = async (baseId, tableIdOrName, data) => {
//     const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

//     var recordData = {'records': data.map(entry => ({'fields': entry}))};
    
//     const response = await fetch(url, {
//         method: 'POST',
//         body: JSON.stringify(recordData),
//         headers: {
//             'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`,
//             'Content-Type': 'application/json'
//         }
//     });
//     const statusMsg = response.ok ? 'Record uploaded successfully.' : 'Error uploading record: '+response.status+" – "+response.statusText;
//     return {'ok': response.ok, 'msg': statusMsg};
// };