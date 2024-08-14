const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sumOfLikes, blog) => {
    return sumOfLikes + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  let topBlog = null;

  blogs?.forEach((blog) => {
    const blogToCheck = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    };
    if (topBlog === null || blogToCheck.likes > topBlog.likes)
      topBlog = blogToCheck;
  });

  return topBlog;
};

const mostBlogs = (blogs) => {
  //NOT using lodash
  const authorBlogCount = {};
  blogs?.forEach((blog) => {
    const author = blog.author;
    if (authorBlogCount[author]) {
      authorBlogCount[author] += 1;
    } else {
      authorBlogCount[author] = 1;
    }
  });

  const { author: topAuthor, count: numberOfBlogs } = Object.entries(
    authorBlogCount
  ).reduce(
    (max, [author, count]) => (count > max.count ? { author, count } : max),
    { author: null, count: 0 }
  );

  return { author: topAuthor, blogs: numberOfBlogs };
};

const mostLikesTotal = (blogs) => {
  //Using lodash
  const authorLikeCount = _.map(
    _.groupBy(blogs, "author"),
    (authorBlogs, author) => ({
      author,
      likes: _.sumBy(authorBlogs, "likes"),
    })
  );

  const topAuthor = _.maxBy(authorLikeCount, "likes");

  return topAuthor || { author: null, likes: 0 };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikesTotal,
};
