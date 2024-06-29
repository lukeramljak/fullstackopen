const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");

const Note = require("../models/note");

describe("when there is initially some notes saved", () => {
  beforeEach(async () => {
    await Note.deleteMany({});
    await Note.insertMany(helper.initialNotes);
  });

  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");

    const contents = response.body.map((r) => r.content);
    assert(contents.includes("Browser can execute only JavaScript"));
  });

  describe("viewing a specific note", () => {
    test("succeeds with a valid id", async () => {
      const notesAtStart = await helper.notesInDb();

      const noteToView = notesAtStart[0];

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultNote.body, noteToView);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new note", () => {
    test("succeeds with valid data", async () => {
      const response = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" });

      const token = response.body.token;

      const newNote = {
        content: "async/await simplifies making async calls",
        important: true,
      };

      await api
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send(newNote)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);

      const contents = notesAtEnd.map((n) => n.content);
      assert(contents.includes("async/await simplifies making async calls"));
    });

    test("fails with status code 400 if data is invalid", async () => {
      const response = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" });

      const token = response.body.token;

      const newNote = {
        important: true,
      };

      await api
        .post("/api/notes")
        .send(newNote)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    });
  });

  describe("deletion of a note", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToDelete = notesAtStart[0];

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

      const notesAtEnd = await helper.notesInDb();

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);

      const contents = notesAtEnd.map((r) => r.content);
      assert(!contents.includes(noteToDelete.content));
    });
  });

  describe("user authentication", () => {
    test("user can login with correct credentials", async () => {
      await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" })
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });
    test("succeeds with status code of 201 if bearer token is valid", async () => {
      const response = await api
        .post("/api/login")
        .send({ username: "root", password: "sekret" });

      const token = response.body.token;

      const newNote = {
        content: "this is a valid note",
        important: true,
      };

      await api
        .post("/api/notes")
        .send(newNote)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);
    });
    test("fails with status code 401 if bearer token is missing", async () => {
      const newNote = {
        content: "this note should not be created",
        important: true,
      };

      await api
        .post("/api/notes")
        .send(newNote)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const notesAtEnd = await helper.notesInDb();
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
