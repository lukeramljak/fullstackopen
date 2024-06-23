const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

describe("when there is initially blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("unique identifier is named 'id'", async () => {
    const blogs = await helper.blogsInDb();
    assert(Object.keys(blogs[0]).includes("id"));
  });

  describe("viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const id = "5a3d5da59070081a82a3445";
      await api.post(`/api/blogs/${id}`).expect(404);
    });
  });

  describe("creating new blogs", async () => {
    test("a new blog can be created", async () => {
      const newBlog = {
        title: "Temporary blog",
        author: "Not a real author",
        url: "https://example.com",
        likes: 0,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const contents = blogsAtEnd.map((blog) => blog.title);
      assert(contents.includes("Temporary blog"));
    });

    test("a blog missing 'likes' will default them to 0", async () => {
      const blogWithoutLikes = {
        title: "No one likes it",
        author: "Nobody",
        url: "https://example.com",
      };

      const response = await api
        .post("/api/blogs")
        .send(blogWithoutLikes)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const returnedBlog = response.body;
      assert.strictEqual(returnedBlog.likes, 0);
    });

    test("missing title or url returns 400", async () => {
      const withoutTitle = {
        author: "Author",
        url: "https://example.com",
      };

      const withoutUrl = {
        title: "I have a title",
        author: "Author",
      };

      await api.post("/api/blogs").send(withoutUrl).expect(400);
      await api.post("/api/blogs").send(withoutTitle).expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
  });

  describe("deleting blogs", () => {
    test("a blog can be successfully deleted", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const id = blogsAtStart[0].id;

      await api.delete(`/api/blogs/${id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strict(!blogsAtEnd.includes(id));
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });
  });

  describe("updating blogs", () => {
    test("a blog's likes can be updated", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const id = blogsAtStart[0].id;

      const updatedNote = {
        likes: 10,
      };

      await api.put(`/api/blogs/${id}`).send(updatedNote).expect(204);
    });
  });
});

after(async () => {
  mongoose.connection.close();
});
