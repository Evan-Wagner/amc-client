
export const getBases = async (airtableApiKey) => {
    const url = `https://api.airtable.com/v0/meta/bases`;

    const headers = {
        'Authorization': `Bearer ${airtableApiKey}`
    };

    const response = await fetch(url, { headers });
    const json = response.ok ? await response.json() : null;
    return { 'recordsJson': json, 'ok': response.ok, 'statusMsg': response.status+'—'+response.statusText }; 
}

export const getRecords = async (airtableApiKey, baseId, tableIdOrName) => {
    const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

    // const airtableApiKey = process.env.AIRTABLE_API_KEY;

    const headers = {
        'Authorization': `Bearer ${airtableApiKey}`
    };

    const response = await fetch(url, { headers });
    const json = response.ok ? await response.json() : null;
    return json;
    // return { 'recordsJson': json, 'ok': response.ok, 'statusMsg': response.status+'—'+response.statusText }; 
}

export const addRecord = async (airtableApiKey, baseId, tableIdOrName, data) => {
    const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`;

    // const airtableApiKey = process.env.AIRTABLE_API_KEY;

    // var recordData = {};

    // Object.entries(data).map(([key, value]) => {
    //     recordData[key] = value.join('\n');
    // })

    var recordData = { 'fields': data };
    
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(recordData),
        headers: {
            'Authorization': `Bearer ${airtableApiKey}`,
            'Content-Type': 'application/json'
        }
    });
    const statusMsg = response.ok ? 'Record uploaded successfully.' : 'Error uploading record: '+response.status+" – "+response.statusText;
    return {'ok': response.ok, 'msg': statusMsg};
}