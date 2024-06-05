'use strict';

function createCategory(db) {
    return (req, res) => {
        const { nombre } = req.body;
        db.run('INSERT INTO categorias (nombre) VALUES (?)', [nombre], function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ id: this.lastID, nombre });
        });
    };
}

function getCategories(db) {
    return (req, res) => {
        db.all('SELECT * FROM categorias', (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ categorias: rows });
        });
    };
}

function updateCategory(db) {
    return (req, res) => {
        const { id } = req.params;
        const { nombre } = req.body;
        db.run('UPDATE categorias SET nombre=? WHERE id=?', [nombre, id], function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ id, nombre });
        });
    };
}

function deleteCategory(db) {
    return (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM categorias WHERE id=?', [id], function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Category deleted' });
        });
    };
}

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
