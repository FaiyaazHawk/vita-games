const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: {type: String, required: true },
    developer: {type: Schema.Types.ObjectId, ref:"Dev", required: true },
    description: {type: String, required: true },
    release_date: {type: Date},
    genre: { type: Schema.Types.ObjectId, ref:"Genre", required: true }
});

module.exports = mongoose.model("Game", GameSchema);