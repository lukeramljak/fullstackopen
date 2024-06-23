const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test.only("a blog's unique identifier is named 'id'", async () => {
  const blog = await helper.blogsInDb();
  assert(Object.keys(blog[0]).includes("id"));
});

test.only("a new blog can be created", async () => {
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

test.only("a blog missing 'likes' will default them to 0", async () => {
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

test.only("missing title or url returns 400", async () => {
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

test.only("a blog can be successfully deleted", async () => {
  const id = helper.initialBlogs[0]._id;

  await api.delete(`/api/blogs/${id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strict(!blogsAtEnd.includes(id));
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

test.only("a blog's likes can be updated", async () => {
  const id = helper.initialBlogs[0]._id;

  const updatedNote = {
    likes: 10,
  };

  await api.put(`/api/blogs/${id}`).send(updatedNote).expect(204);
});

after(async () => {
  mongoose.connection.close();
});
