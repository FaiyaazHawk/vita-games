const Dev = require("../models/dev");
const Game = require("../models/game")
const async = require("async");
const {body, validationResult} = require("express-validator")
const {DateTime} = require("luxon")


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

//GET dev update

exports.dev_update_get = (req,res,next) => {
    async.parallel(
        {
            dev_details(callback) {
                Dev.find({_id: req.params.id}, callback)
            }
        },
        (err,results) => {
            if (err){
                return next (err)
            }
            
            res.render("dev_form", {
                title: "Update Developer form",
                dev_details: results.dev_details[0],
                founded_date: results.dev_details[0].format_date
            })
        }
    )
}

//POST dev update

exports.dev_update_post = [
    //validation
    body("name", "name is required")
        .trim()
        .isLength({min:1})
        .escape(),
    body("founded", "date is optional")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    (req,res,next) => {
        //check for errors
        const errors = validationResult(req)
        //make new dev object
        const dev = {name:req.body.name, founded:req.body.founded};
        //for those who put an existing dev name in here...I boo you
        
        if(!errors.isEmpty()){
            //there are errors
            //rerender form with updated data
            
            res.render("dev_form", {
                title: "Update Developer form. Please enter valid info",
                dev_details: dev,
                founded_date: DateTime.fromJSDate(dev.founded).toISODate()///doesnt work for some reason, maybe cause dev isnt a Dev model object
                
            })
            return;
        } else {
            Dev.findByIdAndUpdate(req.params.id, dev, {}, function(err,updatedDev) {
               if (err) return next(err) ;
               res.redirect(updatedDev.url);
            })
        }

    }
]

//dev delete GET
exports.dev_delete_get = (req,res,next) => {
    //get dev details and id
    
    async.parallel(
        {
            dev(callback) {
                Dev.findOne({_id: req.params.id}, callback)
            }
        },
        (err, results) => {
            if (err) {
                return next (err)
            }
            console.log(results.dev)
            res.render("delete_dev_form", {
                title: "Delete Developer form",
                type: "developer",
                dev: results.dev,
            })

        }
    )
}
//dev delete POST
exports.dev_delete_post = (req,res,next) => {
    Dev.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
          return next (err);
        }
        res.redirect("/");
      })
}