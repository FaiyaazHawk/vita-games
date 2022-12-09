const Game = require("../models/game")
const Dev = require('../models/dev')
const Genre = require('../models/genre')
const async = require('async')

//display list of games
exports.games_list = (req,res,next) => {
    Game.find()
        .sort([["name", "ascending"]])
        .exec(function (err, games_list) {
            if (err){
                return next(err);
            }
        res.render("games_list", {
            title: "Games List",
            games_list:games_list
        });
        })
}

//show details of one game
exports.game_detail = (req,res,next) => {
    Game.findById(req.params.id)
        .exec(function (err, details) {
            if (err) {
                return next(err);
            }
            res.render("game_details", {
                game_details: details,
                game_genres: details.genres
            });
        });
}

// game create on get

exports.game_create_get = (req,res,next) => {
    //async to get games and genres
    async.parallel(
        {
            devs(callback) {
                Dev.find(callback);
            },
            genres(callback) {
                Genre.find(callback)
            },  
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            res.render("game_form",{
                title: "Create game page",
                devs: results.devs,
                genres: results.genres
            })
        }
    )
    
}

// game create on post

exports.game_create_post = []