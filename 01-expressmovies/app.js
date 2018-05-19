const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();

const upload = multer();
const PORT = 3001;

const urlEncodedParser = bodyParser.urlencoded({extended: false});

let frenchMovies = [
    {title:`Larguées`, year:`2018`},
    {title:`Le Fabuleux Destin d'Amélie POULAIN`, year:`2001`},
    {title:`Léon`, year:`1994`},
    {title:`Bienvenue chez les Ch'tis`, year:`2008`},
    {title:`La grande vadrouille`, year:`1966`}
];
app.use('/public', express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/movies', (req, res) => {
    const title = `Film Français des trentes dernieres années`;
    res.render('movies', {frenchMovies, title});
});

app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body){
        res.sendStatus(500);
    }else{
        const formData  = req.body;
        const newMovie = {title:req.body.movieTitle, year:req.body.movieYear}
        frenchMovies = [...frenchMovies, newMovie];
        console.log(frenchMovies);
        res.sendStatus(201);
    }
});

app.get('/movies/add', (req, res) => {
    res.send(`page permettant d'ajouter un film`);
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    res.render('movie-details', { movieId: id});
});

app.get('/movie-search', (req, res) => {
    res.render('movie-search');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

app.get('/connect', (req, res) => {
    res.render('login');
});