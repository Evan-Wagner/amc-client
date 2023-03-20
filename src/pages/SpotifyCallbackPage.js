import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const token = hash.includes('access_token')
      ? hash.substring(1).split('&').find((elem) => elem.startsWith('access_token')).split('=')[1]
      : null;

    if (token) {
      window.localStorage.setItem('token', token);
    }

    const previousPath = window.localStorage.getItem('previousPath') || '/';
    navigate(previousPath, { replace: true });
  }, [navigate]);

  return <div>Processing...</div>;
};

export default SpotifyCallbackPage;
