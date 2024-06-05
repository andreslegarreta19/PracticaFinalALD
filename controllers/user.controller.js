'use strict';

function login(db) {
    return (req, res) => {
        const { email, passwd } = req.body;
        db.get('SELECT * FROM users WHERE email=?', email, (err, row) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!row || row.password !== passwd) return res.status(401).json({ error: 'Invalid credentials' });

            req.session.userID = row.id;
            res.json({ id: row.id, username: row.username, email: row.email, role: row.role, token: 'example-token' });
        });
    };
}

function logout(req, res) {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout error' });
        res.json({ message: 'Logout successful' });
    });
}

function createUser(db) {
    return (req, res) => {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: 'Bad Request: Missing required fields' });
        }

        db.run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, password, role], function (err) {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ id: this.lastID, username, email, role });
        });
    };
}

function getUsers(db) {
    return (req, res) => {
        db.all('SELECT id, username, email, role FROM users', (err, rows) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ usuarios: rows });
        });
    };
}

function updateUser(db) {
    return (req, res) => {
        const { id } = req.params;
        const { username, email, role } = req.body;

        db.get('SELECT password FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            const password = row.password;

            db.run('UPDATE users SET username=?, email=?, password=?, role=? WHERE id=?', [username, email, password, role, id], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ id, username, email, role });
            });
        });
    };
}



function deleteUser(db) {
    return (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM users WHERE id=?', [id], function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'User deleted' });
        });
    };
}

module.exports = { login, logout, createUser, getUsers, updateUser, deleteUser };
