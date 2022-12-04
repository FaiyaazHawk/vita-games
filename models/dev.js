const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DevSchema = new Schema({
    name: {type:String, required: true, maxLength: 100 },
    founded: { type: Date },
    games: {type: Schema.Types.ObjectId, ref: "Game", required: true},
});
//virtual functions
DevSchema.virtual("url").get(function () {
    return `/catalog/dev/${this._id}`;
})

//Export model
module.exports = mongoose.model("Dev", DevSchema);