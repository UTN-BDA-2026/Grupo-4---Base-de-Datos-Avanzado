import PlayerBar from './PlayerBar';

const AppLayout = ({ children }) => {
    return (
        <>
            {children}
            <PlayerBar />
        </>
    );
};

export default AppLayout;