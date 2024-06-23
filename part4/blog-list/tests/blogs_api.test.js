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

after(async () => {
  mongoose.connection.close();
});
