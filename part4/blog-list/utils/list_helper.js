const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0);
};

const favouriteBlog = (blogs) => {
  return blogs.sort((a, b) => a.likes - b.likes)[blogs.length - 1];
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
