import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { shuffleArray, sameSongList } from '../utils/playerHelpers';

const PlayerContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const PlayerProvider = ({ children }) => {
    const audioRef = useRef(new Audio());

    const [queue, setQueue] = useState([]);         // lista original de canciones
    const [playOrder, setPlayOrder] = useState([]);  // índices de `queue`, en orden de reproducción
    const [queuePosition, setQueuePosition] = useState(0); // posición dentro de playOrder

    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(72);
    const [isMuted, setIsMuted] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState('off'); 

    const queueRef = useRef(queue);
    const playOrderRef = useRef(playOrder);
    const queuePositionRef = useRef(queuePosition);
    const repeatModeRef = useRef(repeatMode);
    useEffect(() => { queueRef.current = queue; }, [queue]);
    useEffect(() => { playOrderRef.current = playOrder; }, [playOrder]);
    useEffect(() => { queuePositionRef.current = queuePosition; }, [queuePosition]);
    useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);

    const loadAndPlay = useCallback(async (song) => {
        const audio = audioRef.current;
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
    }, []);

    const play = useCallback((song, songsList, opts = {}) => {
        const audio = audioRef.current;

        if (currentTrack?.deezer_id === song.deezer_id) {
            isPlaying ? audio.pause() : audio.play().catch(console.error);
            setIsPlaying(!isPlaying);
            return;
        }

        const list = songsList && songsList.length ? songsList : [song];
        const songIndex = Math.max(0, list.findIndex((s) => s.deezer_id === song.deezer_id));
        const useShuffle = opts.shuffle ?? shuffle;

        const isNewList = !sameSongList(list, queueRef.current);
        if (isNewList && repeatModeRef.current === 'one') {
            setRepeatMode('all');
        }

        let order = list.map((_, i) => i);
        let position = songIndex;

        if (useShuffle) {
            const rest = order.filter((i) => i !== songIndex);
            order = [songIndex, ...shuffleArray(rest)];
            position = 0;
        }

        if (opts.shuffle !== undefined) setShuffle(opts.shuffle);

        setQueue(list);
        setPlayOrder(order);
        setQueuePosition(position);
        loadAndPlay(list[order[position]]);
    }, [currentTrack, isPlaying, shuffle, loadAndPlay]);

    const playAtPosition = useCallback((position) => {
        const order = playOrderRef.current;
        const list = queueRef.current;
        if (position < 0 || position >= order.length) return;
        setQueuePosition(position);
        loadAndPlay(list[order[position]]);
    }, [loadAndPlay]);

    const next = useCallback(() => {
        const order = playOrderRef.current;
        if (!order.length) return;
        const pos = queuePositionRef.current;

        if (pos + 1 < order.length) {
            playAtPosition(pos + 1);
        } else if (repeatModeRef.current === 'all') {
            playAtPosition(0);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [playAtPosition]);

    const previous = useCallback(() => {
        const audio = audioRef.current;
        const order = playOrderRef.current;
        if (!order.length) return;

        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        const pos = queuePositionRef.current;
        if (pos - 1 >= 0) {
            playAtPosition(pos - 1);
        } else if (repeatModeRef.current === 'all') {
            playAtPosition(order.length - 1);
        } else {
            audio.currentTime = 0;
        }
    }, [playAtPosition]);

    const toggleShuffle = useCallback(() => {
        setShuffle((prev) => {
            const willShuffle = !prev;
            const list = queueRef.current;
            const order = playOrderRef.current;
            const pos = queuePositionRef.current;
            if (!list.length) return willShuffle;

            const currentSongIdx = order[pos];

            if (willShuffle) {
                const rest = list.map((_, i) => i).filter((i) => i !== currentSongIdx);
                setPlayOrder([currentSongIdx, ...shuffleArray(rest)]);
                setQueuePosition(0);
            } else {
                setPlayOrder(list.map((_, i) => i));
                setQueuePosition(currentSongIdx);
            }
            return willShuffle;
        });
    }, []);

    const toggleRepeat = useCallback(() => {
        setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
    }, []);

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

    const setVolume = useCallback((value) => {
        const clamped = Math.min(100, Math.max(0, value));
        audioRef.current.volume = clamped / 100;
        setVolumeState(clamped);
        if (clamped > 0 && isMuted) setIsMuted(false);
        if (clamped === 0) setIsMuted(true);
    }, [isMuted]);

    const toggleMute = useCallback(() => {
        const audio = audioRef.current;
        const nextMuted = !isMuted;
        audio.muted = nextMuted;
        setIsMuted(nextMuted);
    }, [isMuted]);

    useEffect(() => {
        audioRef.current.loop = repeatMode === 'one';
    }, [repeatMode]);

    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume / 100;

        const updateProgress = () => {
            if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        };
        const updateMeta = () => setDuration(audio.duration);
        const handleEnded = () => {
            setProgress(0);
            next();
        };
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
    }, [next]);

    return (
        <PlayerContext.Provider value={{
            currentTrack, isPlaying, progress, duration,
            volume, isMuted, shuffle, repeatMode,
            play, togglePlay, seek, setVolume, toggleMute,
            next, previous, toggleShuffle, toggleRepeat
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);