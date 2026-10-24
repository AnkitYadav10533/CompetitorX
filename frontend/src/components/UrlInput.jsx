import React, { useState } from 'react';
import { Globe, ArrowRight, Sparkles, Key, Zap, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

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
  presets,
  onSelectPreset,
}) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customReq, setCustomReq] = useState(false);

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
      {/* Quick Presets Bar */}
      <div className="presets-bar">
        <span className="presets-label">
          <Zap size={14} className="accent-icon" /> Quick Demo Presets:
        </span>
        <div className="presets-list">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-chip"
              onClick={() => onSelectPreset(preset)}
              title={preset.suggestedRequirement}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="search-card glass-panel">
        <div className="input-grid">
          {/* Product A Input */}
          <div className="url-field-wrapper">
            <div className="field-header">
              <span className="badge badge-primary">Competitor 1 (Product A)</span>
              {urlA && <span className="valid-check"><CheckCircle2 size={13} /> Ready</span>}
            </div>
            <div className="input-icon-box">
              <Globe size={18} className="field-icon icon-cyan" />
              <input
                id="input-url-a"
                type="text"
                className="url-input"
                placeholder="e.g., https://supabase.com"
                value={urlA}
                onChange={(e) => setUrlA(e.target.value)}
                disabled={loading}
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
              title="Swap Competitors"
              disabled={loading}
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {/* Product B Input */}
          <div className="url-field-wrapper">
            <div className="field-header">
              <span className="badge badge-secondary">Competitor 2 (Product B)</span>
              {urlB && <span className="valid-check"><CheckCircle2 size={13} /> Ready</span>}
            </div>
            <div className="input-icon-box">
              <Globe size={18} className="field-icon icon-purple" />
              <input
                id="input-url-b"
                type="text"
                className="url-input"
                placeholder="e.g., https://firebase.google.com"
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
              <Sparkles size={14} className="accent-icon-sparkle" /> Evaluation Lens / Requirement:
            </label>
            {!customReq ? (
              <div className="select-with-custom">
                <select
                  id="req-select"
                  className="custom-select"
                  value={userRequirement}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setCustomReq(true);
                      setUserRequirement('');
                    } else {
                      setUserRequirement(e.target.value);
                    }
                  }}
                  disabled={loading}
                >
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
                  placeholder="e.g. Best for micro-SaaS with offline mobile support..."
                  value={userRequirement}
                  onChange={(e) => setUserRequirement(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="preset-switch-btn"
                  onClick={() => {
                    setCustomReq(false);
                    setUserRequirement(COMMON_REQUIREMENTS[0]);
                  }}
                >
                  Use Presets
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
            <div className="key-drawer-content">
              <div className="key-drawer-header">
                <div className="key-title">
                  <Key size={16} className="icon-cyan" />
                  <strong>TinyFish Agent Infrastructure Key</strong>
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
                CompetitorX connects to <code>POST https://api.fetch.tinyfish.ai</code> for cloud browser rendering and token-optimized markdown extraction.
                If empty, CompetitorX will automatically run our built-in resilient web research agent.
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
          </div>
        )}

        {/* Submit CTA */}
        <div className="submit-row">
          <div className="action-hint">
            <span>⚡ Automated agent extracts pricing, features, audience, & evidence quotes</span>
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
                <span>Agent Researching...</span>
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
