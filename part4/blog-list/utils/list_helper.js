const _ = require("lodash");

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favouriteBlog = (blogs) => {
  return _.maxBy(blogs, "likes");
};

const mostBlogs = (blogs) => {
  const groupedBlogs = _.groupBy(blogs, "author");
  const authorBlogCounts = _.map(groupedBlogs, (blogs, author) => ({
    author: author,
    blogs: blogs.length,
  }));
  return _.maxBy(authorBlogCounts, "blogs");
};

const mostLikes = (blogs) => {
  const groupedBlogs = _.groupBy(blogs, "author");
  const authorLikeCounts = _.map(groupedBlogs, (blogs, author) => ({
    author: author,
    likes: totalLikes(blogs),
  }));
  return _.maxBy(authorLikeCounts, "likes");
};

module.exports = {
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
