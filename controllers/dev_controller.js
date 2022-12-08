const Dev = require("../models/dev");
const Game = require("../models/game")
const async = require("async");


//Show full list of genres

exports.dev_list = (req,res,next) => {
    Dev.find()
        .sort([["name", "ascending"]])
        .exec(function (err, dev_list) {
            if (err) {
                return next(err);
            }
        res.render("dev_list", {
            title: "Developer list",
            dev_list: dev_list,
        });
        })
}

exports.dev_details = (req,res,next) => {
    async.parallel(
        {
            details(callback){
                Dev.findById(req.params.id).exec(callback)
            },
            gamename(callback) {
                Game.find({ dev :req.params.id}).select('title').exec(callback)
            }
        },
        (err,results) => {
            if (err) {
                return next(err);
            }
            console.log(results)
            res.render("dev_details", {
                dev_details: results.details,
                games: results.gamename
            })
        }
    )
}