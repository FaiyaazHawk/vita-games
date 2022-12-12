const Genre = require("../models/genre");
const async = require("async");
const Game = require("../models/game");
const {body, validationResult} = require("express-validator")


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
                Game.find({ genres: req.params.id }).exec(callback);
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

// Show genre create on GET
exports.genre_create_get = (req,res,next) => {
    res.render('genre_form', {title: 'Create Genre'})
}

//Handle genre create on POST
exports.genre_create_post = [
    // Validate and sanitize the name field.
    body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      const genre = new Genre({ name: req.body.name });
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("genre_form", {
          title: "Create Genre",
          genre,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
          if (err) {
            return next(err);
          }
  
          if (found_genre) {
            // Genre exists, redirect to its detail page.
            res.redirect(found_genre.url);
          } else {
            genre.save((err) => {
              if (err) {
                return next(err);
              }
              // Genre saved. Redirect to genre detail page.
              res.redirect(genre.url);
            });
          }
        });
      }
    },
  ]; 

//GET update page

exports.genre_update_get = (req,res,next) => {
  
  async.parallel(
    {
      genre(callback) {
        Genre.findById({_id: req.params.id}, callback)
      }
    },
    (err, results)=> {
      if(err) {
        return next(err)
      }
      res.render("genre_form", {
        title: "Update Genre",
        genre: results.genre,
      })
    }
  )
  
};

//POST update genre page

exports.genre_update_post = [
  body('name', 'name must be specified')
    .trim()
    .isLength({min:1})
    .escape(),

  (req,res,next)=> {
    const errors = validationResult(req);
    const genre = new Genre({name: req.body.name, _id: req.params.id})

    //if error, rerender page
    if(!errors.isEmpty()) {
      res.render('genre_form',{
        title: "Update Genre: Validation error",
        genre: genre,
      })
    } else {
      //check if genre exists with same name, if so, redirect to that page
      async.parallel(
        {
          genre_name(callback) {
            Genre.find({name: genre.name}, callback);
          }
        },
        (err,results) => {
            if (err) {
              return next (err)
            }
            if(results.genre_name.length > 0) {
              //found entry with same name
              console.log("hits here")
              res.redirect(results.genre_name[0].url);
            } else {
              console.log("hits there")
              Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err, updatedgenre) {
                if (err) return next(err);
                res.redirect(updatedgenre.url);
              })
            }
        }
      )

    }
  }
];
  


