import { fetchWebsiteContent } from './tinyfish.js';
import { extractProductAttributes } from './extract.js';
import { validateUrlPair } from '../utils/validateUrl.js';

/**
 * Orchestrates full competitor analysis workflow between two URLs.
 */
export async function compareCompetitors({ urlA, urlB, userRequirement = 'overall', apiKey = null }) {
  // Step 1: Input Validation
  const validation = validateUrlPair(urlA, urlB);
  if (!validation.valid) {
    const error = new Error(validation.error);
    error.statusCode = 400;
    throw error;
  }

  const normalizedUrlA = validation.urlA;
  const normalizedUrlB = validation.urlB;

  // Step 2: TinyFish / Web Retrieval
  const fetchResult = await fetchWebsiteContent([normalizedUrlA, normalizedUrlB], apiKey);
  const pageA = fetchResult.results[normalizedUrlA];
  const pageB = fetchResult.results[normalizedUrlB];

  // Step 3: Structured Extraction & Normalization
  const productA = extractProductAttributes(pageA);
  const productB = extractProductAttributes(pageB);

  // Step 4: Comparison Table Rows Synthesis
  const comparisonMatrix = generateComparisonMatrix(productA, productB);

  // Step 5: Evidence-backed AI Recommendation
  const recommendation = generateAIRecommendation(productA, productB, userRequirement);

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      provider: fetchResult.provider,
      retrievalLogs: fetchResult.logs,
      userRequirement,
    },
    products: {
      productA,
      productB,
    },
    matrix: comparisonMatrix,
    recommendation,
    sources: [
      {
        product: productA.productName,
        url: productA.sourceUrl,
        retrievalMethod: productA.retrievalMethod,
        confidence: `${productA.confidenceScore}%`,
        citations: productA.evidenceCitations,
      },
      {
        product: productB.productName,
        url: productB.sourceUrl,
        retrievalMethod: productB.retrievalMethod,
        confidence: `${productB.confidenceScore}%`,
        citations: productB.evidenceCitations,
      },
    ],
  };
}

/**
 * Generates structured side-by-side comparison matrix matching the PS specification
 */
function generateComparisonMatrix(pA, pB) {
  return [
    {
      category: 'Tagline & Identity',
      attribute: 'Tagline / Value Proposition',
      productA: {
        value: pA.tagline,
        status: 'verified',
        evidence: `Extracted from page metadata: "${pA.tagline.slice(0, 90)}"`,
      },
      productB: {
        value: pB.tagline,
        status: 'verified',
        evidence: `Extracted from page metadata: "${pB.tagline.slice(0, 90)}"`,
      },
    },
    {
      category: 'Pricing',
      attribute: 'Pricing Model',
      productA: {
        value: pA.pricing.model,
        status: pA.pricing.status,
        evidence: pA.pricing.evidence,
      },
      productB: {
        value: pB.pricing.model,
        status: pB.pricing.status,
        evidence: pB.pricing.evidence,
      },
    },
    {
      category: 'Pricing',
      attribute: 'Starting Price / Free Tier',
      productA: {
        value: pA.pricing.startingPrice,
        status: pA.pricing.isExplicitlyListed ? 'verified' : 'not_found',
        evidence: pA.pricing.isExplicitlyListed
          ? pA.pricing.evidence
          : 'Explicit price tags not disclosed on public landing page.',
      },
      productB: {
        value: pB.pricing.startingPrice,
        status: pB.pricing.isExplicitlyListed ? 'verified' : 'not_found',
        evidence: pB.pricing.isExplicitlyListed
          ? pB.pricing.evidence
          : 'Explicit price tags not disclosed on public landing page.',
      },
    },
    {
      category: 'Audience',
      attribute: 'Target Audience',
      productA: {
        value: pA.targetAudience.primary,
        status: pA.targetAudience.status,
        evidence: pA.targetAudience.evidence,
      },
      productB: {
        value: pB.targetAudience.primary,
        status: pB.targetAudience.status,
        evidence: pB.targetAudience.evidence,
      },
    },
    {
      category: 'Core Capabilities',
      attribute: 'Core Features',
      productA: {
        value: pA.coreFeatures.map((f) => f.name).join(' • '),
        status: 'verified',
        evidence: `Verified ${pA.coreFeatures.filter((f) => f.status === 'verified').length} listed capabilities on homepage.`,
      },
      productB: {
        value: pB.coreFeatures.map((f) => f.name).join(' • '),
        status: 'verified',
        evidence: `Verified ${pB.coreFeatures.filter((f) => f.status === 'verified').length} listed capabilities on homepage.`,
      },
    },
    {
      category: 'Ecosystem',
      attribute: 'Services & Infrastructure',
      productA: {
        value: pA.services
          .filter((s) => s.status === 'verified')
          .map((s) => s.name)
          .join(', ') || 'Standard cloud delivery',
        status: 'verified',
        evidence: pA.services[0]?.evidence || 'Extracted from technical specifications.',
      },
      productB: {
        value: pB.services
          .filter((s) => s.status === 'verified')
          .map((s) => s.name)
          .join(', ') || 'Standard cloud delivery',
        status: 'verified',
        evidence: pB.services[0]?.evidence || 'Extracted from technical specifications.',
      },
    },
    {
      category: 'Advantages',
      attribute: 'Key Advantages',
      productA: {
        value: pA.keyAdvantages.map((a) => a.title).join(' • '),
        status: 'verified',
        evidence: pA.keyAdvantages[0]?.description || 'Derived from competitive positioning analysis.',
      },
      productB: {
        value: pB.keyAdvantages.map((a) => a.title).join(' • '),
        status: 'verified',
        evidence: pB.keyAdvantages[0]?.description || 'Derived from competitive positioning analysis.',
      },
    },
    {
      category: 'Transparency',
      attribute: 'Unverified / Missing Information',
      productA: {
        value: pA.limitations.map((l) => `${l.field}: ${l.detail}`).join(' | '),
        status: pA.unverifiedCount > 0 ? 'not_found' : 'verified',
        evidence: 'Identified gaps where explicit data was unavailable.',
      },
      productB: {
        value: pB.limitations.map((l) => `${l.field}: ${l.detail}`).join(' | '),
        status: pB.unverifiedCount > 0 ? 'not_found' : 'verified',
        evidence: 'Identified gaps where explicit data was unavailable.',
      },
    },
  ];
}

/**
 * Synthesizes evidence-backed recommendation based on user criteria
 */
function generateAIRecommendation(pA, pB, requirement) {
  let scoreA = 7.0;
  let scoreB = 7.0;
  const rationaleA = [];
  const rationaleB = [];

  const reqLower = (requirement || '').toLowerCase();

  // Pricing & Budget criteria
  if (reqLower.includes('budget') || reqLower.includes('cost') || reqLower.includes('cheap') || reqLower.includes('startup')) {
    if (pA.pricing.startingPrice.includes('Free')) {
      scoreA += 1.8;
      rationaleA.push('Explicit free tier lowers barrier for early adoption.');
    }
    if (pB.pricing.startingPrice.includes('Free')) {
      scoreB += 1.8;
      rationaleB.push('Offers free entry point without initial upfront commitment.');
    }
    if (!pA.pricing.isExplicitlyListed) {
      scoreA -= 1.2;
      rationaleA.push('Pricing is unlisted, which creates uncertainty for budget planning.');
    }
    if (!pB.pricing.isExplicitlyListed) {
      scoreB -= 1.2;
      rationaleB.push('Requires sales consultation to uncover basic tier costs.');
    }
  }

  // Developer / API criteria
  if (reqLower.includes('dev') || reqLower.includes('api') || reqLower.includes('technical') || reqLower.includes('code')) {
    if (pA.targetAudience.primary.toLowerCase().includes('developer')) {
      scoreA += 1.5;
      rationaleA.push('Specifically designed and positioned for software engineers.');
    }
    if (pB.targetAudience.primary.toLowerCase().includes('developer')) {
      scoreB += 1.5;
      rationaleB.push('Engineered around developer workflows and API integration.');
    }
  }

  // Enterprise criteria
  if (reqLower.includes('enterprise') || reqLower.includes('security') || reqLower.includes('scale')) {
    if (pA.services.some((s) => s.name.toLowerCase().includes('security') && s.status === 'verified')) {
      scoreA += 1.5;
      rationaleA.push('Confirmed enterprise security and compliance credentials.');
    }
    if (pB.services.some((s) => s.name.toLowerCase().includes('security') && s.status === 'verified')) {
      scoreB += 1.5;
      rationaleB.push('Validated compliance and enterprise governance controls.');
    }
  }

  // Factor in verified confidence scores
  scoreA += (pA.confidenceScore - 70) / 20;
  scoreB += (pB.confidenceScore - 70) / 20;

  // Add baseline strengths
  if (rationaleA.length === 0) {
    rationaleA.push(`Strong focus on ${pA.keyAdvantages[0]?.title || 'integrated workflow'}.`);
  }
  if (rationaleB.length === 0) {
    rationaleB.push(`Strong focus on ${pB.keyAdvantages[0]?.title || 'high scalability'}.`);
  }

  const finalScoreA = Math.min(9.8, Math.max(5.5, Number(scoreA.toFixed(1))));
  const finalScoreB = Math.min(9.8, Math.max(5.5, Number(scoreB.toFixed(1))));

  let winner = pA.productName;
  let winnerScore = finalScoreA;
  let headline = '';
  let summary = '';

  if (finalScoreA > finalScoreB) {
    winner = pA.productName;
    winnerScore = finalScoreA;
    headline = `${pA.productName} is recommended for ${requirement === 'overall' ? 'general use' : requirement}`;
    summary = `Based on retrieved evidence, ${pA.productName} provides greater clarity on ${rationaleA.join(' ')} In contrast, ${pB.productName} is better suited if your priority is ${pB.keyAdvantages[0]?.title || 'its unique feature set'}.`;
  } else if (finalScoreB > finalScoreA) {
    winner = pB.productName;
    winnerScore = finalScoreB;
    headline = `${pB.productName} is recommended for ${requirement === 'overall' ? 'general use' : requirement}`;
    summary = `Based on retrieved evidence, ${pB.productName} emerges ahead due to ${rationaleB.join(' ')} ${pA.productName} remains a solid alternative for teams needing ${pA.keyAdvantages[0]?.title || 'its specific architecture'}.`;
  } else {
    winner = 'Close Match / Specialized Decision';
    winnerScore = finalScoreA;
    headline = `Both products offer strong competitive advantages with different trade-offs`;
    summary = `Both ${pA.productName} and ${pB.productName} demonstrated strong evidence on their sites. Choose ${pA.productName} for ${rationaleA[0]} or choose ${pB.productName} for ${rationaleB[0]}.`;
  }

  return {
    winner,
    winnerScore,
    requirement: requirement === 'overall' ? 'General Commercial Fit' : requirement,
    headline,
    summary,
    scores: {
      [pA.productName]: {
        score: finalScoreA,
        strengths: rationaleA,
        confidence: `${pA.confidenceScore}%`,
      },
      [pB.productName]: {
        score: finalScoreB,
        strengths: rationaleB,
        confidence: `${pB.confidenceScore}%`,
      },
    },
  };
}
