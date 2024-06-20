# Phonebook Backend

This is a simple Express-based API for managing a phonebook hosted via [Render](https://fullstackopen-3wd9.onrender.com). The API allows you to view, add, and delete entries from the phonebook. Each entry includes a name and a phone number.

## Endpoints

### Get Information

- **GET** `/info`
  - Returns the number of entries in the phonebook and the current date and time.

### Get All Persons

- **GET** `/api/persons`
  - Returns the entire list of phonebook entries in JSON format.

### Get a Person by ID

- **GET** `/api/persons/:id`
  - Returns a single phonebook entry based on the given ID.
  - Responds with a 404 status if the entry is not found.

### Add a New Person

- **POST** `/api/persons`
  - Adds a new entry to the phonebook.
  - Expects a JSON body with `name` and `number` fields.
  - Validates that both fields are present and that the name is unique.
  - Responds with a 400 status if validation fails.

### Delete a Person

- **DELETE** `/api/persons/:id`
  - Deletes an entry based on the given ID.
  - Responds with a 404 status if the entry is not found.
  - Responds with a 204 status if the deletion is successful.
