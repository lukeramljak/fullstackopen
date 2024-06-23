const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");

describe("total likes", () => {
  const listWithOneBlog = [helper.initialBlogs[0]];
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 7);
  });

  test("sums total amount of likes for multiple blogs", () => {
    const result = listHelper.totalLikes(helper.initialBlogs);
    assert.strictEqual(result, 36);
  });
});

describe("favourite blog", () => {
  test("returns blog with the most likes", () => {
    const result = listHelper.favouriteBlog(helper.initialBlogs);
    assert.deepStrictEqual(result, helper.initialBlogs[2]);
  });
});

describe("most blogs", () => {
  test("returns the author with the most blogs", () => {
    const result = listHelper.mostBlogs(helper.initialBlogs);
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 });
  });
});

describe("most likes", () => {
  test("returns the author with the most likes", () => {
    const result = listHelper.mostLikes(helper.initialBlogs);
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 });
  });
});
