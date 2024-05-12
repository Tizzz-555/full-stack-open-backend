const express = require("express");
const morgan = require("morgan");
const app = express();
require("dotenv").config();

const Person = require("./models/person");

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

let persons = [];

app.get("/", (req, res) => {
  res.send("<h1>This is phonebook backend ☎️</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send(`There are no records with id: ${id}`);
  }
});

app.get("/info", (req, res) => {
  const totalPersons = persons.length;
  res.send(`
  <p>Phonebook has info for ${totalPersons} people</p>
  <p>${Date()}</p>
  `);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: !body.name ? "Name missing" : "Number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result);
      if (result) {
        res
          .status(200)
          .send({
            name: `${result.name}`,
            success: `${result.name} successfully deleted`,
          });
      } else {
        res.status(400).json({ error: "No entry with this Id" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ error: "malformatted id" });
    });
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
