const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const server = express();
const port = 8080;

const sesscfg = {
    secret: 'practicafinal2024',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }
};
server.use(session(sesscfg));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors({
    origin: 'http://127.0.0.1:5500',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


const db = new sqlite3.Database('db/basededatos.db', (err) => {
    if (err) console.error(err);
});

const router = express.Router();
const userController = require('./controllers/user.controller.js');
const categoryController = require('./controllers/categoria.controller.js');
const videoController = require('./controllers/video.controller.js');

router.post('/api/auth/login', userController.login(db));
router.post('/api/auth/logout', userController.logout);
router.post('/api/usuarios', userController.createUser(db));
router.get('/api/usuarios', userController.getUsers(db));
router.put('/api/usuarios/:id', userController.updateUser(db));
router.delete('/api/usuarios/:id', userController.deleteUser(db));

router.post('/api/categorias', categoryController.createCategory(db));
router.get('/api/categorias', categoryController.getCategories(db));
router.put('/api/categorias/:id', categoryController.updateCategory(db));
router.delete('/api/categorias/:id', categoryController.deleteCategory(db));

router.post('/api/videos', videoController.createVideo(db));
router.get('/api/videos', videoController.getVideos(db));
router.get('/api/videosByCategory', videoController.getVideosByCategory(db));
router.put('/api/videos/:id', videoController.updateVideo(db));
router.delete('/api/videos/:id', videoController.deleteVideo(db));

server.use('/', router);
server.use(express.static('.'));

server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
