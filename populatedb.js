#! /usr/bin/env node
console.log('script that populates some games')
// Get arguments passed on command line
var userArgs = process.argv.slice(2);
//modules needed
const async = require('async');
const Dev = require('./models/dev');
const Game = require('./models/game');
const Genre = require('./models/genre');

//mongoose setup

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//storage
var devs = []
var games = []
var genres = []

function devCreate(name, founded, games, cb) {
    devdetail = {name:name, founded:founded}
    
    if (games != false) devdetail.games = games

    let dev = new Dev(devdetail);
    dev.save(function (err) {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New Dev' + dev);
        devs.push(dev)
        cb(null, dev)
    });
}

function gameCreate(title, developer, description, release_date, genre, cb) {
    gamedetail = {title: title, description:description, release_date:release_date}

    if (developer != false) gamedetail.developer = developer;
    if (genre != false) gamedetail.genre = genre;

    let game = new Game (gamedetail);
    game.save(function (err) {
        if(err) {
            cb(err,null)
            return
        }
        console.log('New Game' + game);
        games.push(game)
        cb(null, game)
    })
}

function genreCreate(name, cb) {
    var genre = new Genre({ name: name });
         
    genre.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      console.log('New Genre: ' + genre);
      genres.push(genre)
      cb(null, genre);
    }   );
}

function createGenres(cb) {
    async.series([
        function(callback) {
            genreCreate('RPG', callback);
        },
        function(callback) {
            genreCreate('Shooter', callback);
        },
        function(callback) {
            genreCreate('Adventure', callback)
        }
    ], cb)
}

function createDevs(cb) {
    async.parallel([
        function(callback) {
            devCreate('Atlus', '1986-04-07', games[0], callback)
        },
        function(callback) {
            devCreate('Guerilla Cambridge', '1990', games[1], callback)
        },
        function(callback) {
            devCreate('Bend Studio', '1992', games[2], callback)
        },
    ], cb)
}

function createGames(cb) {
    async.parallel([
        function(callback) {
            gameCreate('Persona 4 Golden', devs[0], 'Persona 4 takes place in a fictional Japanese countryside and is indirectly related to earlier Persona games. The player-named protagonist is a high-school student who moved into the countryside from the city for a year. During his year-long stay, he becomes involved in investigating mysterious murders with a group of friends while harnessing the power to summon physical manifestations of their psyches known as a Persona.', '2008-06-10', genres[0], callback)
        },
        function(callback) {
            gameCreate('Killzone: Mercenary', devs[1], 'Taking place throughout key events and locations of the first three installments of the Killzone franchise, Mercenary follows the story of Arran Danner, a mercenary hired by the ISA.', '2013-09-10', genres[1], callback)
        },
        function(callback) {
            gameCreate('Uncharted: Golden Abyss', devs[2], "Golden Abyss is a prequel to the series, taking place before the events of Uncharted: Drake's Fortune. The story revolves around adventurer-treasure hunter Nathan Drake as he becomes involved in a search for the lost city of Quivira and is aided by fellow treasure hunter Marisa Chase. Gameplay combines action-adventure with platforming elements, with players solving puzzles and fighting enemies using cover-based third-person shooting.", '2012-02-15', genres[2], callback)
        }
    ], cb)
}

async.parallel([
    createGenres,
    createDevs,
    createGames,
], 
//optional callback
function(err, results) {
    if(err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Success')
    }
    mongoose.connection.close();
}
)