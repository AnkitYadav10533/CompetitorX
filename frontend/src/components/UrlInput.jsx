import React, { useState } from 'react';
import { Globe, ArrowRight, Sparkles, Key, CheckCircle2, RefreshCw } from 'lucide-react';

const COMMON_REQUIREMENTS = [
  'Overall Market Comparison',
  'Best for bootstrapped startup on tight budget',
  'Best developer experience & API capabilities',
  'Best enterprise scale, security & compliance',
  'Easiest onboarding for non-technical teams',
];

export default function UrlInput({
  urlA,
  setUrlA,
  urlB,
  setUrlB,
  userRequirement,
  setUserRequirement,
  apiKey,
  setApiKey,
  onCompare,
  loading,
}) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [isCustomReq, setIsCustomReq] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim()) return;
    onCompare();
  };

  const handleSwap = () => {
    const temp = urlA;
    setUrlA(urlB);
    setUrlB(temp);
  };

  return (
    <div className="url-input-container">
      <form onSubmit={handleSubmit} className="search-card glass-panel">
        <div className="input-grid">
          {/* Product A Input */}
          <div className="url-field-wrapper">
            <div className="field-header">
              <span className="badge badge-primary">Competitor 1 (Product A)</span>
              {urlA.trim() && <span className="valid-check"><CheckCircle2 size={13} /> Ready</span>}
            </div>
            <div className="input-icon-box">
              <Globe size={18} className="field-icon icon-cyan" />
              <input
                id="input-url-a"
                type="text"
                className="url-input"
                placeholder="Enter live website URL (e.g. https://your-site.com)"
                value={urlA}
                onChange={(e) => setUrlA(e.target.value)}
                disabled={loading}
                autoFocus
                required
              />
              {urlA && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setUrlA('')}
                  title="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="swap-wrapper">
            <button
              type="button"
              className="swap-btn"
              onClick={handleSwap}
              title="Swap Competitor URLs"
              disabled={loading || (!urlA && !urlB)}
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Product B Input */}
          <div className="url-field-wrapper">
            <div className="field-header">
              <span className="badge badge-secondary">Competitor 2 (Product B)</span>
              {urlB.trim() && <span className="valid-check"><CheckCircle2 size={13} /> Ready</span>}
            </div>
            <div className="input-icon-box">
              <Globe size={18} className="field-icon icon-purple" />
              <input
                id="input-url-b"
                type="text"
                className="url-input"
                placeholder="Enter competitor URL (e.g. https://rival-product.com)"
                value={urlB}
                onChange={(e) => setUrlB(e.target.value)}
                disabled={loading}
                required
              />
              {urlB && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setUrlB('')}
                  title="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Requirements & API Config Row */}
        <div className="controls-row">
          <div className="requirement-selector">
            <label htmlFor="req-select" className="control-label">
              <Sparkles size={14} className="accent-icon-sparkle" /> Evaluation Lens / User Requirement:
            </label>
            {!isCustomReq ? (
              <div className="select-with-custom">
                <select
                  id="req-select"
                  className="custom-select"
                  value={userRequirement}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomReq(true);
                      setUserRequirement('');
                    } else {
                      setUserRequirement(e.target.value);
                    }
                  }}
                  disabled={loading}
                >
                  <option value="">Select evaluation lens (or enter custom)...</option>
                  {COMMON_REQUIREMENTS.map((req, i) => (
                    <option key={i} value={req}>
                      {req}
                    </option>
                  ))}
                  <option value="__custom__">✍️ Enter Custom Requirement...</option>
                </select>
              </div>
            ) : (
              <div className="custom-input-box">
                <input
                  type="text"
                  className="custom-req-input"
                  placeholder="e.g. Best for micro-SaaS with offline sync, or Lowest cost per active user..."
                  value={userRequirement}
                  onChange={(e) => setUserRequirement(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="preset-switch-btn"
                  onClick={() => {
                    setIsCustomReq(false);
                    setUserRequirement(COMMON_REQUIREMENTS[0]);
                  }}
                >
                  Choose Preset Lens
                </button>
              </div>
            )}
          </div>

          {/* TinyFish API Key Button */}
          <div className="api-key-toggle-wrapper">
            <button
              type="button"
              className={`api-key-btn ${apiKey ? 'active' : ''}`}
              onClick={() => setShowKeyModal(!showKeyModal)}
              title="Configure TinyFish API Key"
            >
              <Key size={14} />
              <span>{apiKey ? 'TinyFish Key Active' : 'TinyFish API Key'}</span>
            </button>
          </div>
        </div>

        {/* Optional TinyFish API Key Drawer */}
        {showKeyModal && (
          <div className="key-drawer">
            <div className="key-drawer-header">
              <div className="key-title">
                <Key size={16} className="icon-cyan" />
                <strong>TinyFish Web Agent Infrastructure Key</strong>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={() => setShowKeyModal(false)}
              >
                ✕
              </button>
            </div>
            <p className="key-desc">
              CompetitorX connects to <code>POST https://api.fetch.tinyfish.ai</code> for headless browser rendering and token-optimized markdown extraction.
              If left empty, CompetitorX will extract live webpage data via direct live web agent.
            </p>
            <div className="key-input-row">
              <input
                type="password"
                placeholder="Paste your TinyFish API key (tf_...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="key-input"
              />
              {apiKey && (
                <button
                  type="button"
                  className="clear-key-btn"
                  onClick={() => setApiKey('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Submit CTA */}
        <div className="submit-row">
          <div className="action-hint">
            <span>⚡ Autonomous research agent extracts live pricing, features, audience & evidence quotes</span>
          </div>
          <button
            id="compare-submit-btn"
            type="submit"
            className="btn-primary-glow"
            disabled={loading || !urlA.trim() || !urlB.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Agent Researching Live Websites...</span>
              </>
            ) : (
              <>
                <span>Run CompetitorX Agent</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
