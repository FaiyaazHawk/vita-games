const Genre = require("../models/genre");
const async = require("async");


//Show full list of genres

exports.genre_list = (req,res,next) => {
    Genre.find()
        .sort([["name", "ascending"]])
        .exec(function (err, genre_list) {
            if (err) {
                return next(err);
            }
        res.render("genre_list", {
            title: "Genre list",
            genre_list: genre_list,
        });
        })
}