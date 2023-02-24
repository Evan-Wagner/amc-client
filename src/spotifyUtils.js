import env from 'react-dotenv';

export const getTrack = async (trackId, token) => {
    const url = `https://api.spotify.com/v1/tracks/${trackId}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
}

export const getCurrentTrack = async (token) => {
    const url = `https://api.spotify.com/v1/me/player/currently-playing`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(await response.text());
    } else if (response.status === 204) {
        throw new Error('Could not find a currently playing track.')
    }

    return await response.json();
}

export const parseTrackIdFromSpotifyUrl = (url) => {
    if (!url) {
        throw new Error('No URL provided');
    }

    const regex = /track\/(.*)\?/g;
    const match = regex.exec(url);

    if (!match || match.length < 2) {
        throw new Error('Track ID not found in URL');
    }

    return match[1];
}