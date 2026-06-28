-- ======================================================
-- PARTICIONADO DE ListeningHistory
-- Estrategia: RANGE por año basado en played_at
-- ======================================================

USE music_db;

-- 1. Eliminar índices que pueden interferir (Django los crea automáticamente)
ALTER TABLE users_listeninghistory
DROP INDEX users_liste_user_id_f5a77e_idx,
DROP INDEX users_liste_song_id_678e9b_idx,
DROP INDEX users_liste_played__16c1f6_idx,
DROP INDEX users_liste_user_id_09d238_idx,
DROP INDEX users_liste_song_id_4cc726_idx;

-- 2. Recrear la tabla con particionado
ALTER TABLE users_listeninghistory
PARTITION BY RANGE (YEAR(played_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- 3. Recrear índices después del particionado
CREATE INDEX idx_user ON users_listeninghistory (user_id);
CREATE INDEX idx_song ON users_listeninghistory (song_id);
CREATE INDEX idx_played_at ON users_listeninghistory (played_at);
CREATE INDEX idx_user_played ON users_listeninghistory (user_id, played_at);
CREATE INDEX idx_song_user ON users_listeninghistory (song_id, user_id);