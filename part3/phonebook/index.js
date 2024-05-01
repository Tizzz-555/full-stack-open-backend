const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>This is phonebook backend ☎️</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  console.log(person);
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

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: !body.name ? "Name missing" : "Number missing",
    });
  }

  if (persons.map((person) => person.name).includes(body.name)) {
    return response.status(400).json({
      error: "Name must be unique ",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateRandomId(),
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
