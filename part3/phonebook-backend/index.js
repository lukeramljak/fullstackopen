const express = require("express");
const app = express();
const morgan = require("morgan");

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

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : null;
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/info", (request, response) => {
  const content = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `;

  response.send(content);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).end();
  } else {
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 1000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const handleBadRequest = (msg) => {
    response.status(400).json({
      error: msg,
    });
  };

  if (!body.name) {
    return handleBadRequest("name is required");
  } else if (!body.number) {
    return handleBadRequest("number is required");
  }

  const personExists = persons.find((person) => person.name === body.name);
  if (personExists) {
    return handleBadRequest("name must be unique");
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});