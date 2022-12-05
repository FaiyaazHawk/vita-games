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