const Dev = require("../models/dev");
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