const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const configServer = require('./config/expressConfig');
const dbConfig = require('./config/dbConfig');
const mongoose = require('mongoose');
const faker = require('faker');
const app = express();
const upload = multer();

faker.locale = "fr";

//const urlEncodedParser = configServer.urlEncodedParser;
const fakeUser = {email:"deder@deder.fr", password: "PassWord", user :"deder"};
console.log(`${dbConfig.protocol}${dbConfig.login}:${dbConfig.password}@${dbConfig.url}`);
const db = mongoose.connection;
mongoose.connect(`${dbConfig.protocol}${dbConfig.url}`);
//const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect'));
db.once('open', () => {
    console.log('connected to the DB :)');
});

const movieSchema = mongoose.Schema({
    movieTitle: String,
    movieYear: Number
});

const Movie = mongoose.model('Movie', movieSchema)

/*
const title = faker.lorem.sentence(3);
const year = Math.floor(Math.random() * 80) + 1950;

const myMovie = new Movie({
    movieTitle: title,
    movieYear: year
});

myMovie.save((err, savedMovie) => {
    if(err){
        console.log(err);
    }else{
        console.log("savedMovie", savedMovie);
    }
});
*/

let frenchMovies = [];

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
app.use(expressJwt({secret:configServer.secret}).unless({path: [url.root, url.connect, url.movies, url.addMovie, , url.searchMovie, new RegExp('/movies.*/', 'i')]}));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.get(url.root, (req, res) => {
    res.render('index');
});

app.get(url.movies, (req, res) => {
    const title = `Film Français des trentes dernieres années`;

    frenchMovies = [];
    Movie.find((err, movies) =>{
        if(err){
            console.error(err);
            res.sendStatus(500);
        }else{
            frenchMovies = movies;
            res.render('movies', {frenchMovies, title});
        }
    });
    
});

app.post(url.movies, upload.fields([]), (req, res) => {
    if(!req.body){
        res.sendStatus(500);
    }else{
        const formData  = req.body;
        const myMovie = new Movie({
            movieTitle:formData.movieTitle,
            movieYear:formData.movieYear
        });
        myMovie.save((err, savedMovie) =>{
            if(err){
                console.error(err);
                res.sendStatus(500);
            }else{
                console.log("savedMovie", savedMovie);
                res.sendStatus(201);
            }

        })
    }
});


app.get(url.selectMovie, (req, res) => {
    const id = req.params.id;
    res.render('movie-details', { movieId: id});
});

app.put("/movies/:id", (req, res) => {
    const id = req.params.id;
    res.send(`Put request to movie of id ${id}`);
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