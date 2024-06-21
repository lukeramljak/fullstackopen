require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");

morgan.token("body", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : null;
});

app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", async (request, response) => {
  const numberOfPersons = await Person.find({})
    .then((result) => result.length)
    .catch(() => 0);
  const content = `
    <p>Phonebook has info for ${numberOfPersons} ${
    numberOfPersons === 1 ? "person" : "people"
  }</p>
    <p>${new Date()}</p>
  `;

  response.send(content);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((result) => {
    response.json(result);
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
