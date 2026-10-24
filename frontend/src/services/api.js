/**
 * API service for CompetitorX frontend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
      urlA,
      urlB,
      userRequirement: userRequirement || 'overall',
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
  } catch (err) {
    console.warn('Failed to load presets from backend, using client fallback', err);
    return [
      {
        id: 'supabase-firebase',
        label: 'Supabase vs Firebase',
        category: 'Backend as a Service',
        urlA: 'https://supabase.com',
        urlB: 'https://firebase.google.com',
        suggestedRequirement: 'Best for open source developer wanting SQL database',
      },
      {
        id: 'linear-jira',
        label: 'Linear vs Jira',
        category: 'Issue Tracking',
        urlA: 'https://linear.app',
        urlB: 'https://www.atlassian.com/software/jira',
        suggestedRequirement: 'Fastest issue tracking for agile startup engineering teams',
      },
      {
        id: 'notion-coda',
        label: 'Notion vs Coda',
        category: 'Workspaces',
        urlA: 'https://notion.so',
        urlB: 'https://coda.io',
        suggestedRequirement: 'Best collaborative workspace with free tier for small teams',
      },
    ];
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
