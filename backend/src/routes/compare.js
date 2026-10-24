import express from 'express';
import { compareCompetitors } from '../services/compare.js';

const router = express.Router();

/**
 * Curated presets for instant 1-click testing & hackathon presentations
 */
const PRESETS = [
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
    category: 'Issue Tracking & Project Management',
    urlA: 'https://linear.app',
    urlB: 'https://www.atlassian.com/software/jira',
    suggestedRequirement: 'Fastest issue tracking for fast-moving startup engineering teams',
  },
  {
    id: 'notion-coda',
    label: 'Notion vs Coda',
    category: 'Docs & Collaborative Workspaces',
    urlA: 'https://notion.so',
    urlB: 'https://coda.io',
    suggestedRequirement: 'Best collaborative workspace with free tier for small teams',
  },
  {
    id: 'stripe-adyen',
    label: 'Stripe vs Adyen',
    category: 'Fintech & Payment Infrastructure',
    urlA: 'https://stripe.com',
    urlB: 'https://www.adyen.com',
    suggestedRequirement: 'Developer-friendly global payment processing',
  },
];

/**
 * POST /api/compare
 * Body: { urlA, urlB, userRequirement, apiKey }
 */
router.post('/compare', async (req, res, next) => {
  try {
    const { urlA, urlB, userRequirement, apiKey } = req.body;

    if (!urlA || !urlB) {
      return res.status(400).json({
        success: false,
        error: 'Both urlA and urlB are required.',
      });
    }

    // Pass header API key if provided in X-TinyFish-Key header
    const headerKey = req.headers['x-tinyfish-key'] || apiKey;

    const result = await compareCompetitors({
      urlA,
      urlB,
      userRequirement: userRequirement || 'overall',
      apiKey: headerKey,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/presets
 */
router.get('/presets', (req, res) => {
  res.json({
    success: true,
    presets: PRESETS,
  });
});

export default router;
