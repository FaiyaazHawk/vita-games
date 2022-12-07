const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: {type: String, required: true },
    dev: {type: Schema.Types.ObjectId, ref:"Dev", },
    description: {type: String, required: true },
    release_date: {type: Date},
    genres: [{ type: Schema.Types.ObjectId, ref:"Genre", }],
});
//virtual functions
GameSchema.virtual("url").get(function () {
    return `/games/${this._id}`;
})


module.exports = mongoose.model("Game", GameSchema);