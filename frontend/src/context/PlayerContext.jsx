import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

const PlayerContext = createContext(null);
const API_BASE_URL = 'http://localhost:8000/api';

export const PlayerProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const play = useCallback(async (song) => {
        const audio = audioRef.current;

        if (currentTrack?.deezer_id === song.deezer_id) {
            isPlaying ? audio.pause() : audio.play().catch(console.error);
            setIsPlaying(!isPlaying);
            return;
        }

        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio.load();

        audio.src = `${API_BASE_URL}/music/songs/${song.deezer_id}/preview/`;

        const onCanPlay = async () => {
            try {
                await audio.play();
                setCurrentTrack(song);
                setIsPlaying(true);
            } catch (err) {
                console.error("Error al reproducir:", err);
            } finally {
                audio.removeEventListener('canplaythrough', onCanPlay);
            }
        };

        audio.addEventListener('canplaythrough', onCanPlay);
        audio.load();
    }, [currentTrack, isPlaying]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!currentTrack) return;
        isPlaying ? audio.pause() : audio.play();
        setIsPlaying(!isPlaying);
    }, [currentTrack, isPlaying]);

    const seek = useCallback((percent) => {
        const audio = audioRef.current;
        if (!duration) return;
        audio.currentTime = (percent / 100) * duration;
    }, [duration]);

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const updateMeta = () => setDuration(audio.duration);
        const handleEnded = () => { setIsPlaying(false); setProgress(0); };
        const handleError = () => { setIsPlaying(false); console.warn("Error en el stream"); };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateMeta);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateMeta);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, []);

    return (
        <PlayerContext.Provider value={{ currentTrack, isPlaying, progress, duration, play, togglePlay, seek }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);