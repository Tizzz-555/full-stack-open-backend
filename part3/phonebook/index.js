const express = require("express");
const morgan = require("morgan");
const app = express();
require("dotenv").config();

const Person = require("./models/person");

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  if (error.message === "No entry with this Id") {
    return res.status(404).json({ error: error.message });
  }

  if (error.message === "Name missing" || error.message === "Number missing") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.get("/", (req, res) => {
  res.send("<h1>This is phonebook backend ☎️</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      const totalPersons = persons.length;
      res.send(`
  <p>Phonebook has info for ${totalPersons} people</p>
  <p>${Date()}</p>
  `);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    throw new Error(!body.name ? "Name missing" : "Number missing");
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).send({
          name: result.name,
          success: `${result.name} successfully deleted`,
        });
      } else {
        throw new Error("No entry with this Id");
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
