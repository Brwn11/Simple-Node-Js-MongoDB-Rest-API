const express = require("express");
const Joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");
const genreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
});
const Genre = mongoose.model("Genres", genreSchema);

async function createCourse() {
  const genre = Genre({ _id: String, name: "SciFi" });
  const result = await genre.save();
  console.log(result);
}

// createCourse();

// const genres = [
//   { id: 1, name: "Action" },
//   { id: 2, name: "Horror" },
//   { id: 3, name: "Romance" },
// ];
async function getGenres() {
  const genres = await Genre.find();
  console.log(genres);
  return genres;
}
// GET API
router.get("/", async (req, res) => {
  const genres = await getGenres();
  res.send(genres);
});
// POST API
router.post("/", async (req, res) => {
  const genre = Genre({
    name: req.body.name,
  });
  try {
    const result = await genre.save();
    res.send(result);
  } catch (err) {
    res.send(err.message);
  }
  // res.send(genre);

  // const { error } = validateGenre(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  // const genres = await getGenres();
  // const genre = {
  //   id: genres.length + 1,
  //   name: req.body.name,
  // };
  // genres.push(genre);
});

async function updateCourse(id , name) {
  let genre = await Genre.findById(id);
  if (!genre) {
    return res.status(404).send("The Couse with the given id was not found");
  }
  try {
    genre = Genre({
      name: name,
    });
    const result = genre.save();
    console.log(result);
    return res.send(genre);
  } catch (err) {
    return res.send(err.message);
  }
}
// PUT API

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findByIdAndUpdate(req.params.id, {name : req.body.name}, {new:true});
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});
// DELET API
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    res.status(404).send("The Couse with the given id was not found");
  }
  res.send(genre);

});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

module.exports = router;
