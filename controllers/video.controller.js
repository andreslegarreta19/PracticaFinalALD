'use strict';

function createVideo(db) {
    return (req, res) => {
        const { nombre, categoria_id, url } = req.body;

        if (!nombre || !url || !categoria_id) {
            return res.status(400).json({ error: 'Bad Request: Missing required fields' });
        }

        db.run('INSERT INTO videos (nombre, categoria_id, url) VALUES (?, ?, ?)', [nombre, categoria_id, url], function (err) {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ id: this.lastID, nombre, categoria_id, url });
        });
    };
}

function getVideos(db) {
    return (req, res) => {
        db.all('SELECT * FROM videos', (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ videos: rows });
        });
    };
}

function getVideosByCategory(db) {
    return (req, res) => {
        const { categoria_id } = req.query;
        db.all('SELECT * FROM videos WHERE categoria_id=?', [categoria_id], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ videos: rows });
        });
    };
}

function updateVideo(db) {
    return (req, res) => {
        const { id } = req.params;
        const { nombre, categoria_id, url } = req.body;

        if (!nombre || !url || !categoria_id) {
            return res.status(400).json({ error: 'Bad Request: Missing required fields' });
        }

        db.run('UPDATE videos SET nombre=?, categoria_id=?, url=? WHERE id=?', [nombre, categoria_id, url, id], function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ id, nombre, categoria_id, url });
        });
    };
}

function deleteVideo(db) {
    return (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM videos WHERE id=?', [id], function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Video deleted' });
        });
    };
}

module.exports = { createVideo, getVideos, getVideosByCategory, updateVideo, deleteVideo };
