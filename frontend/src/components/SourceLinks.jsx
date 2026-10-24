import React from 'react';
import { ExternalLink, CheckCircle, AlertCircle, Bookmark, Shield } from 'lucide-react';

export default function SourceLinks({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="source-links-section glass-panel">
      <div className="source-links-header">
        <div className="source-header-titles">
          <div className="title-with-icon">
            <Shield size={18} className="icon-cyan" />
            <h3 className="section-title">Evidence & Verifiable Sources</h3>
          </div>
          <p className="section-subtitle">
            Every extracted data point is grounded in live website copy with original URLs and confidence metrics.
          </p>
        </div>
      </div>

      <div className="sources-grid">
        {sources.map((src, index) => (
          <div key={index} className="source-card">
            <div className="source-card-header">
              <div className="source-title-group">
                <Bookmark size={15} className="accent-icon" />
                <h4 className="source-product-name">{src.product}</h4>
              </div>
              <span className="source-confidence-pill">
                Confidence: <strong>{src.confidence}</strong>
              </span>
            </div>

            <div className="source-url-row">
              <span className="source-url-text">{src.url}</span>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-direct-btn"
                title="Verify at original URL"
              >
                <span>Visit Source</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="citations-list">
              <div className="citations-label">Extracted Findings & Grounded Quotes:</div>
              {src.citations && src.citations.map((cite, cIdx) => (
                <div key={cIdx} className={`citation-item ${cite.verified ? 'verified' : 'unverified'}`}>
                  <div className="citation-top">
                    <span className="citation-claim">{cite.claim}</span>
                    {cite.verified ? (
                      <span className="cite-badge verified">
                        <CheckCircle size={11} /> Confirmed Fact
                      </span>
                    ) : (
                      <span className="cite-badge unverified">
                        <AlertCircle size={11} /> Unverified / Not Found
                      </span>
                    )}
                  </div>
                  <div className="citation-finding">{cite.finding}</div>
                  {cite.evidence && (
                    <blockquote className="citation-quote">
                      {cite.evidence}
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
