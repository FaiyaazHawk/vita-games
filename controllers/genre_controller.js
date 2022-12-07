const Genre = require("../models/genre");
const async = require("async");
const Game = require("../models/game")


//Show full list of genres

exports.genre_list = (req,res,next) => {
    Genre.find()
        .sort([["name", "ascending"]])
        .exec(function (err, list_genre) {
            if (err) {
                return next(err);
            }
        res.render("genre_list", {
            title: "Genre list",
            genre_list: list_genre,
        });
        });
};

//Show detail of one genre

exports.genre_details = (req,res,next) => {
    async.parallel(
        {
            genre(callback) {
                Genre.findById(req.params.id).exec(callback);
            },

            genre_games(callback) {
                Game.find({ genre: req.params.id }).exec(callback);
            },
        },
        (err,results) => {
            if (err) {
                return next(err)
            }
            //no genre results
            if(results.genre == null) {
                const err = new Error("Genre not found")
                err.status = 404;
                return next(err);
            }
            res.render("genre_details", {
                title: "Genre details",
                genre: results.genre,
                game_list: results.genre_games,
            })
        }
    )
}