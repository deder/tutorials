const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const configServer = require('./config/expressConfig');
const dbConfig = require('./config/dbConfig');
const mongoose = require('mongoose');
const app = express();

const upload = multer();
//const urlEncodedParser = configServer.urlEncodedParser;
const fakeUser = {email:"deder@deder.fr", password: "PassWord", user :"deder"};
mongoose(`${dbConfig.protocol}${dbConfig.login}:${dbConfig.password}@${dbConfig.url}`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect'));
db.once('open', () => {
    console.log('connected to the DB :)');
});
let frenchMovies = [
    {title:`Larguées`, year:`2018`},
    {title:`Le Fabuleux Destin d'Amélie POULAIN`, year:`2001`},
    {title:`Léon`, year:`1994`},
    {title:`Bienvenue chez les Ch'tis`, year:`2008`},
    {title:`La grande vadrouille`, year:`1966`}
];

var user = {
    login: "fcosta",
    mdp:"dederUser"
};

var url = {
    root:"/",
    staticContent: "/public",
    movies: "/movies",
    addMovie: "/movies/add",
    selectMovie: "/movies/:id",
    searchMovie: "/movie-search",
    connect: "/connect",
    member: "/member-only"
};


app.use(url.staticContent , express.static('public'));
app.use(expressJwt({secret:configServer.secret}).unless({path: [url.root, url.connect, url.movies, url.addMovie, , url.searchMovie]}));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.get(url.root, (req, res) => {
    res.render('index');
});

app.get(url.movies, (req, res) => {
    const title = `Film Français des trentes dernieres années`;
    res.render('movies', {frenchMovies, title});
});

app.post(url.movies, upload.fields([]), (req, res) => {
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

app.get(url.addMovie, (req, res) => {
    res.send(`page permettant d'ajouter un film`);
});

app.get(url.selectMovie, (req, res) => {
    const id = req.params.id;
    res.render('movie-details', { movieId: id});
});

app.get(url.searchMovie, (req, res) => {
    res.render('movie-search');
});

app.get(url.connect, (req, res) => {
    res.render('login', {title:"Espace membres"});
});

app.post(url.connect, upload.fields([]),  (req, res) => {
    console.log(req.body);
    if(!req.body){
        res.sendStatus(500);
    }else{
        const formData  = req.body;
        if(fakeUser.user == req.body.login && fakeUser.password == req.body.mdp){
            const myToken = jwt.sign({
                iss:'http://expressmovie.fr',
                user:'sam',
                role: 'moderator'
            }, configServer.secret);
            res.json(myToken);
        }else{
            res.sendStatus(401);
        }
    }
});

app.get(url.member, (req, res) =>{
    res.send(req.user);
});
app.listen(configServer.port, () => {
    console.log(`listening on port ${configServer.port}`);
});