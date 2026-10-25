const https = require('https');

const RSS_FEEDS = [
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://www.theverge.com/rss/frontpage',
  'https://www.nasa.gov/rss/dyn/breaking_news.rss'
];

function getTagContent(xml, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(pattern);
  if (!match) return '';
  return decodeXmlEntities(stripHtml(match[1] || ''));
}

function stripHtml(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeXmlEntities(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function getAttributeValue(tag, attributeName) {
  const pattern = new RegExp(`${attributeName}="([^"]+)"`, 'i');
  const match = tag.match(pattern);
  return match ? decodeXmlEntities(match[1]) : '';
}

function parseRssFeed(xml) {
  const items = [];
  const matches = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)];

  for (const match of matches) {
    const block = match[1] || '';
    const title = getTagContent(block, 'title');
    const link = getTagContent(block, 'link');
    const description = getTagContent(block, 'description') || getTagContent(block, 'content:encoded') || '';
    const date = getTagContent(block, 'pubDate') || getTagContent(block, 'dc:date') || new Date().toISOString();
    const enclosure = [...block.matchAll(/<enclosure\b[^>]*\surl="([^"]+)"/gi)][0]?.[1] || '';
    const media = [...block.matchAll(/<media:content\b[^>]*\surl="([^"]+)"/gi)][0]?.[1] || '';

    if (!title || !link) continue;

    items.push({
      title,
      url: link,
      summary: description || title,
      date,
      image: enclosure || media || '',
      category: guessCategory(`${title} ${description}`)
    });
  }

  return items;
}

function guessCategory(text = '') {
  const lower = String(text).toLowerCase();

  if (/(business|market|finance|economy|bank|startup|stock|trade|price|inflation|industry)/.test(lower)) {
    return 'Business';
  }
  if (/(sport|football|soccer|basketball|cricket|tennis|league|match|olympic|nba|nfl)/.test(lower)) {
    return 'Sports';
  }
  if (/(politic|election|government|minister|parliament|campaign|senate|policy|president|law)/.test(lower)) {
    return 'Politics';
  }
  if (/(culture|movie|film|music|celebrity|festival|tv|entertainment|artist)/.test(lower)) {
    return 'Culture';
  }
  if (/(health|medical|hospital|doctor|vaccine|disease|wellness|science|research)/.test(lower)) {
    return 'Health';
  }
  if (/(tech|technology|ai|software|startup|gadget|cyber|computer|chip|digital|software)/.test(lower)) {
    return 'Technology';
  }
  if (/(space|science|planet|orbit|rocket|nasa|climate|environment|energy)/.test(lower)) {
    return 'Science';
  }

  return 'World';
}

function dedupeArticles(list = []) {
  const seen = new Set();
  return list.filter((article) => {
    const key = `${article.title}|${article.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(article.title && article.url);
  });
}

function buildSections(articles = []) {
  const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
  const top = sorted.slice(0, 8);
  const biztech = sorted.filter((article) => /business|technology|science|health/i.test(article.category)).slice(0, 6);
  const fun = sorted.filter((article) => /culture|sports/i.test(article.category)).slice(0, 6);

  return {
    updated: new Date().toISOString(),
    top,
    biztech,
    fun
  };
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GlobalMediaBot/1.0; +https://example.com)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchText(new URL(res.headers.location, url).toString()).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk.toString();
      });
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('Request timeout')));
  });
}

async function fetchNewsFeed() {
  let merged = [];

  for (const url of RSS_FEEDS) {
    try {
      const xml = await fetchText(url);
      const items = parseRssFeed(xml);
      merged = merged.concat(items);
    } catch (error) {
      console.warn(`Failed to fetch RSS feed: ${url}`, error.message);
    }
  }

  const unique = dedupeArticles(merged).map((article) => ({
    ...article,
    title: String(article.title || '').trim(),
    summary: String(article.summary || '').replace(/\s+/g, ' ').trim(),
    url: String(article.url || '').trim(),
    category: article.category || 'World',
    date: new Date(article.date || Date.now()).toISOString()
  }));

  if (!unique.length) {
    return {
      updated: new Date().toISOString(),
      top: [
        {
          title: 'Live feed unavailable right now',
          summary: 'The news source is temporarily unavailable. The site will refresh automatically when the feed comes back online.',
          url: '#',
          image: '',
          category: 'World',
          date: new Date().toISOString()
        }
      ],
      biztech: [],
      fun: []
    };
  }

  return buildSections(unique);
}

module.exports = {
  fetchNewsFeed,
  guessCategory
};

