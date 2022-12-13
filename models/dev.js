const mongoose = require("mongoose");
const {DateTime} = require("luxon");

const Schema = mongoose.Schema;

const DevSchema = new Schema({
    name: {type:String, required: true, maxLength: 100 },
    founded: { type: Date },
    games: [{type: Schema.Types.ObjectId, ref: "Game", }],
});
//virtual functions
DevSchema.virtual("url").get(function () {
    return `/devs/${this._id}`;
})
DevSchema.virtual("formatted_date").get(function () {
    return this.founded ?
    DateTime.fromJSDate(this.founded).toISODate() : '';
})

//Export model
module.exports = mongoose.model("Dev", DevSchema);