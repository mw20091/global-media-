module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/ads.txt");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");
  eleventyConfig.addWatchTarget("src/assets");

  eleventyConfig.addFilter("truncate", (value, length = 145) => {
    if (!value) return "";
    if (typeof value !== "string") value = String(value);
    return value.length > length ? value.slice(0, length).trim() + "..." : value;
  });

  eleventyConfig.addFilter("limit", (arr, max) => {
    if (!Array.isArray(arr)) return [];
    const limit = Number(max);
    return Number.isFinite(limit) ? arr.slice(0, limit) : arr;
  });

  eleventyConfig.addFilter("reject", (arr, test, target) => {
    if (!Array.isArray(arr)) return [];

    return arr.filter((item) => {
      if (test === "equalto") {
        return item !== target;
      }

      if (item && typeof item === "object" && Object.prototype.hasOwnProperty.call(item, test)) {
        return item[test] !== target;
      }

      return true;
    });
  });

  eleventyConfig.addCollection("categories", (collectionApi) => {
    const categories = new Set();
    collectionApi.getFilteredByGlob("src/posts/*.md").forEach((post) => {
      if (post.data.category) categories.add(post.data.category);
    });
    return [...categories].sort();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
