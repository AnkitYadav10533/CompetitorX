/**
 * API service for CompetitorX frontend
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

export async function compareWebsites({ urlA, urlB, userRequirement, apiKey }) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (apiKey && apiKey.trim()) {
    headers['X-TinyFish-Key'] = apiKey.trim();
  }

  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      urlA: urlA.trim(),
      urlB: urlB.trim(),
      userRequirement: userRequirement?.trim() || 'overall',
      apiKey: apiKey?.trim() || undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to compare websites.');
  }

  return data.data;
}

export async function fetchPresets() {
  try {
    const response = await fetch(`${API_BASE_URL}/presets`);
    const data = await response.json();
    return data.presets || [];
  } catch {
    return [];
  }
}

export async function fetchHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch {
    return { status: 'offline' };
  }
}
