import { Outlet } from 'react-router-dom';
import PlayerBar from './PlayerBar';

const AppLayout = () => {
    return (
        <>
            <Outlet />
            <PlayerBar />
        </>
    );
};

export default AppLayout;