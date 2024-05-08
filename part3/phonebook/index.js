const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
require("dotenv").config();
const Person = require("./models/person");

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

const generateRandomId = () => {
  const randomId = Math.floor(Math.random() * 10000);
  return randomId;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: !body.name ? "Name missing" : "Number missing",
    });
  }

  if (persons.map((person) => person.name).includes(body.name)) {
    return res.status(400).json({
      error: "Name must be unique ",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateRandomId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).json({ error: "Person not found" });
  }

  persons = persons.filter((person) => person.id !== id);

  res.status(200).json(person);
});

const PORT = 3000;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
