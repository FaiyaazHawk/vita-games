const Dev = require("../models/dev");
const Game = require("../models/game")
const async = require("async");
const {body, validationResult} = require("express-validator")


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

//dev create on GET
exports.dev_create_get = (req,res,next) => {
    res.render("dev_form", {
        title: "Create Developer Page"
    })
}

//dev create on POST

exports.dev_create_post = [
    //validation
    body("name", "Developer name is required")
        .trim()
        .isLength({min:1})
        .escape(),
    body("founded", "Founding date is optional")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    //check for errors
    (req,res,next) => {
        //see if errors
        const errors = validationResult(req);
        //make new dev object
        
        const dev = new Dev({name: req.body.name, founded: req.body.founded})

        if(!errors.isEmpty()) {
            res.render("dev_form", {
                title: "Create Developer",
                dev,
                errors: errors.array(),
            });
            return;
        } else {
            //data is valid
            //check if dev exists
            Dev.findOne({name: req.body.name}).exec((err,found_dev)=>{
                if(err){
                    return next(err);
                }
                if (found_dev) {
                    res.redirect(found_dev.url);
                } else {
                    dev.save((err)=> {
                        if(err) {
                            return next(err)
                        }
                        //dev saved. redirect to dev detail page.
                        res.redirect(dev.url);
                    })
                }
            })
        }



    }
]

