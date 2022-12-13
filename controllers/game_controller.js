const Game = require("../models/game")
const Dev = require('../models/dev')
const Genre = require('../models/genre')
const async = require('async')
const {body,validationResult} = require('express-validator')
const {DateTime} = require("luxon")

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
            //get dev and genre names from ids
            
            async.parallel(
                {
                    dev_name(callback) {
                        Dev.find({_id: details.dev}, callback)
                    },
                    genre_list(callback) {
                        Genre.find({_id:{$in:details.genres}}, callback)
                    }
                },
                (err,results) => {
                    
                    res.render("game_details", {
                        game_details: details,
                        dev: results.dev_name[0],
                        genres: results.genre_list
                    });
                }
                
            )
            
            
        });
}

// game create on get

exports.game_create_get = (req,res,next) => {
    //async to get devs and genres
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

//game update GET

exports.game_update_get = (req,res,next) => {
    //get game,dev and genres
    
    async.parallel(
        {
            game(callback){
                Game.find({_id: req.params.id}, callback)
            },
            devs(callback) {
                Dev.find(callback)
            },
            genres(callback) {
                Genre.find(callback)
            },
            
            
        },
        (err,results) => {
            if (err) {
                return next (err);
            }
            
            res.render("game_form", {
                title: "Update Game form",
                game:results.game[0],
                release_date: results.game[0].format_date,
                devs:results.devs,
                genres:results.genres,
                //cant figure out how to set default dev and genre
            })
        }
    )
}

//game update POST

exports.game_update_post = [
    //sanitize
    body('title', 'title is required')
        .trim()
        .isLength({min:1})
        .escape(),
    body('description', "description is required")
        .trim()
        .isLength({min:1})
        .escape(),
    body('release_date', 'release_date is required')
        .isISO8601()
        .toDate(),
    (req,res,next) => {
        //check for errors
        const errors = validationResult(req);
        //grab devs and genres for re render
        //update game item with new req stats
        const game = {
            title: req.body.title,
            description: req.body.description,
            release_date: req.body.release_date,
            dev: req.body.dev,
            genres: req.body.genres,
        }
        
        async.parallel(
            {
                devs(callback) {
                    Dev.find(callback)
                },
                genres(callback) {
                    Genre.find(callback)
                }
            },
            (err,results) => {
                if (err) {
                    return next(err);
                }
                if(!errors.isEmpty()) {
                    res.render("game_form", {
                        title: "Game Update form. Please enter Valid Data",
                        game:game,
                        release_date: DateTime.fromJSDate(game.release_date).toISODate(),
                        devs: results.devs,
                        genres: results.genres,
                    })
                    return;
                } else {
                    Game.findByIdAndUpdate(req.params.id, game, {}, function(err, updatedGame){
                        if(err) return next(err);
                        res.redirect(updatedGame.url);
                    })
                }
                
            }
        )
        
        
    }
]