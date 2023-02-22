import env from 'react-dotenv';

export const getBases = async () => {
    const url = `https://api.airtable.com/v0/meta/bases`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`
        }
    });
    const json = response.ok ? await response.json() : null;
    return json;
}

export const getRecords = async (baseId, tableIdOrName) => {
    const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`
        }
    });

    const json = response.ok ? await response.json() : null;
    return json;
}

export const addRecords = async (baseId, tableIdOrName, data) => {
    const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

    var recordData = {'records': data.map(entry => ({'fields': entry}))};
    
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(recordData),
        headers: {
            'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    const statusMsg = response.ok ? 'Record uploaded successfully.' : 'Error uploading record: '+response.status+" – "+response.statusText;
    return {'ok': response.ok, 'msg': statusMsg};
}