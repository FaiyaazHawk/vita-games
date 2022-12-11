const Game = require("../models/game")
const Dev = require('../models/dev')
const Genre = require('../models/genre')
const async = require('async')
const {body,validationResult} = require('express-validator')

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

exports.game_create_post = [
    //validation
    body("title","title is required")
        .trim()
        .isLength({min:1})
        .escape(),
    body("description","description is required")
        .trim()
        .notEmpty()
        .escape(),
    body('release_date', 'release date is required')
        .isISO8601()
        .toDate(),
    //check for errors
    (req,res,next)=> {
        //generate errors object
        const errors = validationResult(req);
        //make new game item with data
        console.log(req)
        const game = new Game({
            title: req.body.title,
            description: req.body.description,
            release_date: req.body.release_date,
            dev: req.body.dev,
            genres: req.body.genres,
        });
        if(!errors.isEmpty()) {
            res.render("game_form", {
                title: "Create game page",
                game,
                errors: errors.array()
            })
            return;
        } else {
            //data is valid
            //check if game exists
            Game.findOne({title: req.body.title}).exec((err,found_game)=>{
                if(err){
                    return next(err);
                }
                if(found_game){
                    res.redirect(found_game.url)
                } else {
                    game.save((err)=>{
                        if(err) {
                            return next(err)
                        }
                        //game saved, return to game detail page
                        res.redirect(game.url);
                    })
                }
            })
        }
    }
]