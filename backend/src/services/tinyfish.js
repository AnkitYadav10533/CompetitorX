import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Configure Turndown to clean up noisy elements
turndownService.remove(['script', 'style', 'noscript', 'iframe', 'svg', 'canvas', 'footer', 'nav', 'header']);

/**
 * Fetch live website content using TinyFish Fetch API (POST https://api.fetch.tinyfish.ai)
 * with direct browser-grade HTTP retrieval for live user-provided URLs.
 */
export async function fetchWebsiteContent(urls, apiKey = null) {
  const effectiveKey = apiKey || process.env.TINYFISH_API_KEY;
  const logs = [];

  logs.push({
    step: 'init',
    message: `Initiating live web research for user-provided URLs: ${urls.join(' and ')}`,
    timestamp: new Date().toISOString(),
  });

  // Attempt TinyFish Fetch API if API key is present
  if (effectiveKey && effectiveKey.trim() !== '') {
    try {
      logs.push({
        step: 'tinyfish_request',
        message: 'Connecting to live TinyFish Web Agent API (https://api.fetch.tinyfish.ai)...',
        timestamp: new Date().toISOString(),
      });

      const response = await axios.post(
        'https://api.fetch.tinyfish.ai',
        { urls },
        {
          headers: {
            'X-API-Key': effectiveKey.trim(),
            'Content-Type': 'application/json',
          },
          timeout: 25000,
        }
      );

      if (response.data && Array.isArray(response.data.results) && response.data.results.length > 0) {
        logs.push({
          step: 'tinyfish_success',
          message: `Successfully retrieved live page content for ${response.data.results.length} URLs via TinyFish`,
          timestamp: new Date().toISOString(),
        });

        const resultMap = {};
        for (const item of response.data.results) {
          resultMap[item.url] = {
            url: item.url,
            finalUrl: item.final_url || item.url,
            title: item.title || extractDomainName(item.url),
            description: item.description || '',
            markdown: item.text || '',
            retrievalMethod: 'tinyfish',
            status: 'success',
            fetchedAt: new Date().toISOString(),
          };
        }

        // Check if any url was in errors or missing
        for (const url of urls) {
          if (!resultMap[url]) {
            logs.push({
              step: 'tinyfish_partial_fallback',
              message: `URL ${url} not returned by TinyFish. Fetching directly from live site...`,
              timestamp: new Date().toISOString(),
            });
            resultMap[url] = await fetchLiveUrlContent(url, logs);
          }
        }

        return {
          results: resultMap,
          provider: 'tinyfish',
          logs,
        };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      logs.push({
        step: 'tinyfish_api_notice',
        message: `TinyFish API returned: ${errMsg}. Fetching live website content directly...`,
        timestamp: new Date().toISOString(),
      });
    }
  } else {
    logs.push({
      step: 'direct_agent_init',
      message: 'Extracting live page content directly from user-provided URLs...',
      timestamp: new Date().toISOString(),
    });
  }

  // Live direct retrieval from the user's URLs
  const resultMap = {};
  for (const url of urls) {
    resultMap[url] = await fetchLiveUrlContent(url, logs);
  }

  return {
    results: resultMap,
    provider: effectiveKey ? 'tinyfish_fallback' : 'direct_agent',
    logs,
  };
}

/**
 * Directly fetches and extracts clean markdown & metadata from the user's live URL.
 * Throws genuine errors if the URL cannot be reached so the user sees real status.
 */
async function fetchLiveUrlContent(url, logs) {
  logs.push({
    step: 'live_fetch_start',
    message: `Sending HTTP request to user website: ${url}`,
    timestamp: new Date().toISOString(),
  });

  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CompetitorX/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 18000,
      maxRedirects: 5,
    });

    const html = res.data;
    if (typeof html !== 'string') {
      throw new Error(`The URL ${url} did not return HTML content.`);
    }

    const $ = cheerio.load(html);

    // Extract real title from user site
    const title =
      $('title').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      extractDomainName(url);

    // Extract real description from user site
    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    // Remove scripts, stylesheets, and irrelevant chrome
    $('script, style, noscript, svg, canvas, iframe, nav, footer, header, #cookie-banner, .cookie-banner').remove();

    // Prefer main content element, or fallback to body
    let contentHtml = $('main').html() || $('article').html() || $('#content').html() || $('body').html() || '';
    let markdown = '';
    try {
      markdown = turndownService.turndown(contentHtml);
    } catch {
      markdown = $('body').text().replace(/\s+/g, ' ').trim();
    }

    // Limit markdown length to token-sane size
    if (markdown.length > 25000) {
      markdown = markdown.substring(0, 25000) + '\n\n...[Page content parsed for comparison]';
    }

    logs.push({
      step: 'live_fetch_success',
      message: `Retrieved live content for ${url} (Title: "${title.slice(0, 45)}", Length: ${markdown.length} chars)`,
      timestamp: new Date().toISOString(),
    });

    return {
      url,
      finalUrl: res.request?.res?.responseUrl || url,
      title,
      description,
      markdown,
      retrievalMethod: 'direct_agent',
      status: 'success',
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    logs.push({
      step: 'live_fetch_error',
      message: `Failed to fetch live content from ${url}: ${err.message}`,
      timestamp: new Date().toISOString(),
    });

    // Throw clear error so user knows their specific URL was not reachable
    const error = new Error(`Could not access live website at ${url} (${err.message}). Please verify that the URL is public, correctly typed, and accessible.`);
    error.statusCode = 422;
    throw error;
  }
}

function extractDomainName(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '').split('.')[0] || 'Unknown';
  } catch {
    return 'Website';
  }
}
