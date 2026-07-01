export const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};


export const sameSongList = (a, b) => {
    if (a.length !== b.length) return false;
    const idsA = a.map((s) => s.deezer_id).slice().sort();
    const idsB = b.map((s) => s.deezer_id).slice().sort();
    return idsA.every((id, i) => id === idsB[i]);
};