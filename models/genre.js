const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: {type:String}
});
//virtual functions
GenreSchema.virtual("url").get(function () {
    return `/genres/${this._id}`;
})

//Export model
module.exports = mongoose.model("Genre", GenreSchema);