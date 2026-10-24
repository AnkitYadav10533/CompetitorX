/**
 * URL validation and normalization utility
 */

export function normalizeUrl(input) {
  if (!input || typeof input !== 'string') return '';
  let trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

export function validateUrl(input) {
  if (!input || typeof input !== 'string' || !input.trim()) {
    return { valid: false, error: 'URL cannot be empty.' };
  }

  const normalized = normalizeUrl(input);

  try {
    const parsed = new URL(normalized);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS protocol.' };
    }

    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { valid: false, error: 'URL must contain a valid domain name (e.g., example.com).' };
    }

    return { valid: true, normalizedUrl: normalized, hostname: parsed.hostname };
  } catch (err) {
    return { valid: false, error: `Invalid URL format: ${err.message}` };
  }
}

export function validateUrlPair(urlA, urlB) {
  const resultA = validateUrl(urlA);
  if (!resultA.valid) {
    return { valid: false, error: `Product A URL error: ${resultA.error}` };
  }

  const resultB = validateUrl(urlB);
  if (!resultB.valid) {
    return { valid: false, error: `Product B URL error: ${resultB.error}` };
  }

  if (resultA.normalizedUrl === resultB.normalizedUrl) {
    return { valid: false, error: 'Please enter two different website URLs to compare.' };
  }

  return {
    valid: true,
    urlA: resultA.normalizedUrl,
    urlB: resultB.normalizedUrl,
    hostnameA: resultA.hostname,
    hostnameB: resultB.hostname,
  };
}
