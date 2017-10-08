const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  url: String
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
