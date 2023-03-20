import { Routes, Route } from 'react-router-dom';

import TunesPage from './TunesPage';
import HomePage from './HomePage';
import ErrorPage from './ErrorPage';
import SpotifyCallbackPage from './SpotifyCallbackPage';

const routes = [
    {
        path: '*',
        component: ErrorPage,
    },
    {
        path: '/spotify-callback',
        component: SpotifyCallbackPage,
    },
    {
        path: '/',
        component: HomePage,
        exact: true,
        navLabel: 'Home',
    },
    {
        path: '/tunes',
        component: TunesPage,
        navLabel: 'Tunes',
    }
];

const Pages = ({ token }) => {
    return (
        <Routes>
            {routes.map((route, index) => (
            <Route
                key={index}
                path={route.path}
                element={<route.component token={token} />}
            />
            ))}
        </Routes>
    );
};

export default Pages;

export { routes };