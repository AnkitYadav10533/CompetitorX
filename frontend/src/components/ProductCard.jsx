import React from 'react';
import { ExternalLink, ShieldCheck, Tag, Users, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function ProductCard({ product, type = 'A' }) {
  if (!product) return null;

  const isTypeA = type === 'A';
  const accentClass = isTypeA ? 'accent-cyan' : 'accent-purple';
  const badgeClass = isTypeA ? 'badge-primary' : 'badge-secondary';

  return (
    <div className={`product-card glass-panel ${accentClass}`}>
      <div className="card-top-bar">
        <div className="card-identity">
          <span className={`badge ${badgeClass}`}>Competitor {type}</span>
          <span className="retrieval-pill">
            <span className="pulse-dot"></span>
            {product.retrievalMethod === 'tinyfish' ? 'TinyFish Live Agent' : 'Web Agent Verified'}
          </span>
        </div>
        <a
          href={product.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="visit-link"
          title={`Visit ${product.productName}`}
        >
          <span>Visit Website</span>
          <ExternalLink size={13} />
        </a>
      </div>

      <div className="card-header">
        <h3 className="product-title">{product.productName}</h3>
        <p className="product-tagline">{product.tagline}</p>
      </div>

      {/* Confidence Score Bar */}
      <div className="confidence-section">
        <div className="confidence-header">
          <span className="confidence-label">
            <ShieldCheck size={14} className="icon-cyan" /> Evidence Grounding Confidence
          </span>
          <span className="confidence-value">{product.confidenceScore}%</span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${product.confidenceScore}%` }}
          ></div>
        </div>
      </div>

      {/* Key Quick Facts Grid */}
      <div className="card-facts-grid">
        <div className="fact-item">
          <div className="fact-header">
            <Tag size={13} className="fact-icon" />
            <span className="fact-label">Starting Price</span>
          </div>
          <div className="fact-value">
            {product.pricing.isExplicitlyListed ? (
              <span className="price-tag-verified">
                <CheckCircle size={12} /> {product.pricing.startingPrice}
              </span>
            ) : (
              <span className="price-tag-unverified">
                <AlertCircle size={12} /> Not Listed on Page
              </span>
            )}
          </div>
        </div>

        <div className="fact-item">
          <div className="fact-header">
            <Users size={13} className="fact-icon" />
            <span className="fact-label">Primary Audience</span>
          </div>
          <div className="fact-value text-truncate" title={product.targetAudience.primary}>
            {product.targetAudience.primary.split(',')[0]}
          </div>
        </div>
      </div>

      {/* Highlights / Strengths */}
      <div className="card-strengths">
        <div className="strengths-label">Key Strengths:</div>
        <div className="strengths-tags">
          {product.keyAdvantages.map((adv, i) => (
            <span key={i} className="strength-chip" title={adv.description}>
              <Sparkles size={11} /> {adv.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
