const { describe, test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

const helper = require("./test_helper");

const User = require("../models/user");

describe("when there is initially one user in the db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Luke Ramljak",
      name: "Luke Ramljak",
      password: "bigchungus",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
  });

  test("creation fails with status code 400 with invalid username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "hi",
      name: "Luke Ramljak",
      password: "bigchungus",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("or more characters"));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with status code 400 with invalid password", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "valid",
      name: "Luke Ramljak",
      password: "hi",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("or more characters"));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  mongoose.connection.close();
});
