const { fetchNewsFeed } = require('../lib/news');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const payload = await fetchNewsFeed();
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      updated: new Date().toISOString(),
      top: [],
      biztech: [],
      fun: [],
      error: error.message
    });
  }
};

