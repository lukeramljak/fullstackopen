const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favouriteBlog = (blogs) => {
  return blogs.sort((a, b) => a.likes - b.likes)[blogs.length - 1];
};

const mostBlogs = (blogs) => {
  const groupedBlogs = _.groupBy(blogs, "author");
  const authorBlogCounts = _.map(groupedBlogs, (blogs, author) => ({
    author: author,
    blogs: blogs.length,
  }));
  return _.maxBy(authorBlogCounts, "blogs");
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
};
