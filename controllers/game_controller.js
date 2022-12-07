const Game = require("../models/game")

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
            console.log(details)
            res.render("game_details", {
                game_details: details,
                game_genres: details.genres
            });
        });
}