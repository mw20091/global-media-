module.exports = async () => {
  const feeds = [
    { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World' },
    { name: 'BBC Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business' },
    { name: 'BBC Technology', url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology' },
    { name: 'BBC Science', url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'Science' },
    { name: 'BBC Sport', url: 'https://feeds.bbci.co.uk/sport/rss.xml', category: 'Sports' }
  ];

  const fallbackImageByCategory = {
    World: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    Business: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    Science: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=1200&q=80',
    Sports: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1200&q=80',
    Politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    Default: 'https://images.unsplash.com/photo-1504711331083-9c895941bf81?auto=format&fit=crop&w=1200&q=80'
  };

  const decodeHtml = (value = '') =>
    String(value)
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const extractTag = (source, tag) => {
    const match = source.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return match ? decodeHtml(match[1]) : '';
  };

  const getCategory = (title, summary = '') => {
    const text = `${title} ${summary}`.toLowerCase();
    if (text.includes('business') || text.includes('market') || text.includes('economy')) return 'Business';
    if (text.includes('tech') || text.includes('ai ') || text.includes('software') || text.includes('startup')) return 'Technology';
    if (text.includes('sport') || text.includes('football') || text.includes('cricket') || text.includes('tennis')) return 'Sports';
    if (text.includes('science') || text.includes('climate') || text.includes('space')) return 'Science';
    if (text.includes('election') || text.includes('politics') || text.includes('government')) return 'Politics';
    return 'World';
  };

  const normalizeArticle = (item, feed) => {
    const cleanTitle = item.title?.trim() || 'Latest update';
    const cleanSummary = item.summary?.trim() || cleanTitle;
    const category = item.category || getCategory(cleanTitle, cleanSummary);
    return {
      title: cleanTitle,
      summary: cleanSummary,
      url: item.url || '#',
      source: feed.name,
      category,
      date: item.date || new Date().toISOString(),
      image: item.image || fallbackImageByCategory[category] || fallbackImageByCategory.Default
    };
  };

  const fallbackData = () => ({
    ticker: [
      { title: 'Global markets rally as investors monitor the latest central bank signals', url: '#', summary: 'Markets continue to watch rates and growth data in the latest global trading session.', source: 'Global Media', category: 'Business', date: new Date().toISOString(), image: fallbackImageByCategory.Business },
      { title: 'Global leaders push for new trade and energy cooperation as supply chains stabilize', url: '#', summary: 'Officials say cooperation and resilience remain central to future economic growth.', source: 'Global Media', category: 'World', date: new Date().toISOString(), image: fallbackImageByCategory.World },
      { title: 'AI and chipmakers intensify investment as demand for next-generation infrastructure rises', url: '#', summary: 'Technology leaders are expanding capacity and research to keep pace with surging demand.', source: 'Global Media', category: 'Technology', date: new Date().toISOString(), image: fallbackImageByCategory.Technology }
    ],
    top: [
      { title: 'Global leaders push for new trade and energy cooperation as supply chains stabilize', url: '#', summary: 'Officials say cooperation and resilience remain central to future economic growth.', source: 'Global Media', category: 'World', date: new Date().toISOString(), image: fallbackImageByCategory.World },
      { title: 'AI and chipmakers intensify investment as demand for next-generation infrastructure rises', url: '#', summary: 'Technology leaders are expanding capacity and research to keep pace with surging demand.', source: 'Global Media', category: 'Technology', date: new Date().toISOString(), image: fallbackImageByCategory.Technology },
      { title: 'Markets rebound as investors assess slowing inflation and resilient consumer demand', url: '#', summary: 'Analysts say improving sentiment is drawing buyers back to growth-focused sectors.', source: 'Global Media', category: 'Business', date: new Date().toISOString(), image: fallbackImageByCategory.Business },
      { title: 'Scientists outline a more resilient climate strategy for cities facing extreme weather pressure', url: '#', summary: 'Researchers say adaptation, infrastructure, and early warning tools are now central to urban planning.', source: 'Global Media', category: 'Science', date: new Date().toISOString(), image: fallbackImageByCategory.Science }
    ],
    latest: [
      { title: 'Global leaders push for new trade and energy cooperation as supply chains stabilize', url: '#', summary: 'Officials say cooperation and resilience remain central to future economic growth.', source: 'Global Media', category: 'World', date: new Date().toISOString(), image: fallbackImageByCategory.World },
      { title: 'AI and chipmakers intensify investment as demand for next-generation infrastructure rises', url: '#', summary: 'Technology leaders are expanding capacity and research to keep pace with surging demand.', source: 'Global Media', category: 'Technology', date: new Date().toISOString(), image: fallbackImageByCategory.Technology },
      { title: 'Markets rebound as investors assess slowing inflation and resilient consumer demand', url: '#', summary: 'Analysts say improving sentiment is drawing buyers back to growth-focused sectors.', source: 'Global Media', category: 'Business', date: new Date().toISOString(), image: fallbackImageByCategory.Business },
      { title: 'Scientists outline a more resilient climate strategy for cities facing extreme weather pressure', url: '#', summary: 'Researchers say adaptation, infrastructure, and early warning tools are now central to urban planning.', source: 'Global Media', category: 'Science', date: new Date().toISOString(), image: fallbackImageByCategory.Science },
      { title: 'Global sport calendars fill with fresh fixtures as major events prepare for a busy season', url: '#', summary: 'Fans and event planners are bracing for a packed run of championships, qualifiers, and international competitions.', source: 'Global Media', category: 'Sports', date: new Date().toISOString(), image: fallbackImageByCategory.Sports }
    ],
    business: [
      { title: 'Markets rebound as investors assess slowing inflation and resilient consumer demand', url: '#', summary: 'Analysts say improving sentiment is drawing buyers back to growth-focused sectors.', source: 'Global Media', category: 'Business', date: new Date().toISOString(), image: fallbackImageByCategory.Business },
      { title: 'AI and chipmakers intensify investment as demand for next-generation infrastructure rises', url: '#', summary: 'Technology leaders are expanding capacity and research to keep pace with surging demand.', source: 'Global Media', category: 'Technology', date: new Date().toISOString(), image: fallbackImageByCategory.Technology },
      { title: 'Global leaders push for new trade and energy cooperation as supply chains stabilize', url: '#', summary: 'Officials say cooperation and resilience remain central to future economic growth.', source: 'Global Media', category: 'World', date: new Date().toISOString(), image: fallbackImageByCategory.World }
    ],
    fun: [
      { title: 'Global sport calendars fill with fresh fixtures as major events prepare for a busy season', url: '#', summary: 'Fans and event planners are bracing for a packed run of championships, qualifiers, and international competitions.', source: 'Global Media', category: 'Sports', date: new Date().toISOString(), image: fallbackImageByCategory.Sports },
      { title: 'Creative industries push new formats and partnerships as audiences keep shifting platforms', url: '#', summary: 'Writers, studios, and media brands are rethinking distribution and audience engagement in real time.', source: 'Global Media', category: 'World', date: new Date().toISOString(), image: fallbackImageByCategory.World }
    ],
    updated: new Date().toISOString()
  });

  try {
    const allArticles = [];
    const seen = new Set();

    for (const feed of feeds) {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GlobalMedia/1.0; +https://example.com)'
        }
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const itemMatches = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)];

      for (const match of itemMatches) {
        const chunk = match[1];
        const title = extractTag(chunk, 'title');
        const link = extractTag(chunk, 'link');
        const description = extractTag(chunk, 'description') || extractTag(chunk, 'summary') || extractTag(chunk, 'content:encoded') || '';
        const pubDate = extractTag(chunk, 'pubDate') || new Date().toISOString();

        if (!title || !link) continue;
        const key = `${title}|${link}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const item = normalizeArticle({
          title,
          url: link,
          summary: description,
          date: pubDate,
          category: feed.category,
          image: null
        }, feed);

        allArticles.push(item);
      }
    }

    if (!allArticles.length) {
      return fallbackData();
    }

    const sorted = [...allArticles].sort((a, b) => new Date(b.date) - new Date(a.date));
    const top = sorted.slice(0, 6);
    const latest = sorted.slice(0, 8);
    const business = sorted.filter((item) => /business|market|economy|technology|startup|ai|science/i.test(`${item.title} ${item.summary}`)).slice(0, 4);
    const fun = sorted.filter((item) => /sport|culture|entertainment|travel|music|film|media/i.test(`${item.title} ${item.summary}`)).slice(0, 4);

    return {
      ticker: sorted.slice(0, 8),
      top,
      latest,
      business,
      fun,
      updated: new Date().toISOString()
    };
  } catch (error) {
    console.warn('News data unavailable, using fallback data:', error);
    return fallbackData();
  }
};

