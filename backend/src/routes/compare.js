import express from 'express';
import { compareCompetitors } from '../services/compare.js';

const router = express.Router();

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
 * Presets removed in favor of live user-provided data
 */
router.get('/presets', (req, res) => {
  res.json({
    success: true,
    presets: [],
  });
});

export default router;
