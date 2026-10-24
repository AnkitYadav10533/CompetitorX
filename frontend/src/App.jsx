import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Download,
  FileText,
  Terminal,
  AlertCircle,
  CheckCircle2,
  Cpu,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
} from 'lucide-react';

import UrlInput from './components/UrlInput';
import ProductCard from './components/ProductCard';
import ComparisonTable from './components/ComparisonTable';
import RecommendationCard from './components/RecommendationCard';
import SourceLinks from './components/SourceLinks';
import LoadingState from './components/LoadingState';
import { compareWebsites } from './services/api';
import { exportComparisonPdf } from './services/pdfExport';

export default function App() {
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [userRequirement, setUserRequirement] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('competitorx-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('competitorx-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCompare = async () => {
    if (!urlA.trim() || !urlB.trim()) {
      setError('Please provide two valid website URLs to compare.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await compareWebsites({
        urlA,
        urlB,
        userRequirement: userRequirement || 'overall',
        apiKey,
      });
      setResult(data);
    } catch (err) {
      console.error('Comparison error:', err);
      setError(err.message || 'Failed to compare websites. Please verify URLs.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!result) return;
    setIsExportingPdf(true);
    try {
      exportComparisonPdf(result);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    const { products, matrix, recommendation } = result;
    const pA = products.productA;
    const pB = products.productB;

    let md = `# CompetitorX Comparison Report\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n`;
    md += `**Target A:** [${pA.productName}](${pA.sourceUrl})\n`;
    md += `**Target B:** [${pB.productName}](${pB.sourceUrl})\n`;
    md += `**Evaluation Lens:** ${recommendation.requirement}\n\n`;

    md += `## 🏆 AI Recommendation\n`;
    md += `**Winner:** ${recommendation.winner} (${recommendation.winnerScore}/10)\n`;
    md += `**Verdict:** ${recommendation.headline}\n\n`;
    md += `${recommendation.summary}\n\n`;

    md += `## 📊 Comparison Matrix\n\n`;
    md += `| Attribute | ${pA.productName} | ${pB.productName} |\n`;
    md += `| :--- | :--- | :--- |\n`;

    for (const row of matrix) {
      md += `| **${row.attribute}** | ${row.productA.value} (${row.productA.status}) | ${row.productB.value} (${row.productB.status}) |\n`;
    }

    md += `\n## 🔗 Verifiable Sources\n`;
    md += `- [${pA.productName}](${pA.sourceUrl}) (Evidence Confidence: ${pA.confidenceScore}%)\n`;
    md += `- [${pB.productName}](${pB.sourceUrl}) (Evidence Confidence: ${pB.confidenceScore}%)\n\n`;
    md += `*Generated automatically by CompetitorX AI Agent powered by TinyFish.*`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitorx-${pA.productName.toLowerCase()}-vs-${pB.productName.toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      {/* Background ambient neon glow spheres */}
      <div className="ambient-glow glow-cyan"></div>
      <div className="ambient-glow glow-purple"></div>

      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-badge">
            <Cpu size={22} className="logo-icon" />
          </div>
          <div className="brand-titles">
            <h1 className="brand-name">
              Competitor<span className="brand-gradient">X</span>
            </h1>
            <span className="brand-tagline">AI-Powered Website Comparison Agent</span>
          </div>
        </div>

        <div className="header-meta">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            type="button"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} className="theme-icon sun" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={15} className="theme-icon moon" />
                <span>Dark</span>
              </>
            )}
          </button>
          <div className="agent-badge">
            <span className="live-pulse"></span>
            <span>Live Web Agent Active</span>
          </div>
          {result && (
            <div className="export-actions-group">
              <button
                onClick={handleExportPdf}
                className="export-btn export-pdf-btn"
                title="Download Executive PDF Report"
                disabled={isExportingPdf}
              >
                <FileText size={14} className="icon-pdf" />
                <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>
              <button
                onClick={handleExportMarkdown}
                className="export-btn"
                title="Export Report to Markdown"
              >
                <Download size={14} />
                <span>Markdown</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="app-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-badge">
            <Sparkles size={14} className="accent-icon-sparkle" />
            <span>Autonomous Web Research & Grounded Evidence Engine</span>
          </div>
          <h2 className="hero-headline">
            Compare Any Two Products with <span className="headline-highlight">Evidence-Backed</span> Intelligence
          </h2>
          <p className="hero-description">
            Enter any two live product URLs. CompetitorX accesses the websites, extracts real pricing tiers,
            audits features, identifies target audiences, and synthesizes side-by-side comparisons grounded in source evidence.
          </p>
        </section>

        {/* Live URL Inputs & Requirement Controls */}
        <UrlInput
          urlA={urlA}
          setUrlA={setUrlA}
          urlB={urlB}
          setUrlB={setUrlB}
          userRequirement={userRequirement}
          setUserRequirement={setUserRequirement}
          apiKey={apiKey}
          setApiKey={setApiKey}
          onCompare={handleCompare}
          loading={loading}
        />

        {/* Error Notification */}
        {error && (
          <div className="error-banner glass-panel">
            <AlertCircle size={20} className="error-icon" />
            <div className="error-content">
              <strong>Comparison Encountered An Issue</strong>
              <p>{error}</p>
            </div>
            <button className="error-dismiss" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        {/* Loading Radar Timeline */}
        {loading && <LoadingState urlA={urlA} urlB={urlB} />}

        {/* Comparison Results Dashboard */}
        {result && !loading && (
          <div className="results-dashboard">
            {/* Results Status Header */}
            <div className="results-meta-bar glass-panel">
              <div className="meta-left">
                <CheckCircle2 size={16} className="icon-success" />
                <span>
                  Live comparison generated via{' '}
                  <strong>
                    {result.meta.provider === 'tinyfish'
                      ? 'TinyFish Headless Cloud Agent'
                      : 'Live Web Research Agent'}
                  </strong>
                </span>
              </div>
              <div className="meta-right-actions">
                <button
                  onClick={handleExportPdf}
                  className="export-btn export-pdf-btn"
                  title="Download Executive PDF Report"
                  disabled={isExportingPdf}
                >
                  <FileText size={14} className="icon-pdf" />
                  <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
                </button>
                <button
                  className="logs-toggle-btn"
                  onClick={() => setShowLogs(!showLogs)}
                >
                  <Terminal size={14} />
                  <span>Agent Execution Trace ({result.meta.retrievalLogs?.length || 0} steps)</span>
                  {showLogs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>

            {/* Collapsible Execution Log Trace */}
            {showLogs && (
              <div className="logs-terminal glass-panel">
                <div className="terminal-header">
                  <span className="term-dot red"></span>
                  <span className="term-dot yellow"></span>
                  <span className="term-dot green"></span>
                  <span className="term-title">Agent Execution Trace & Live Research Log</span>
                </div>
                <div className="terminal-body">
                  {result.meta.retrievalLogs?.map((log, lIdx) => (
                    <div key={lIdx} className="terminal-line">
                      <span className="term-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="term-step">[{log.step}]</span>
                      <span className="term-msg">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendation Banner */}
            <RecommendationCard
              recommendation={result.recommendation}
              productA={result.products.productA}
              productB={result.products.productB}
            />

            {/* Product Overview Cards */}
            <div className="products-grid">
              <ProductCard product={result.products.productA} type="A" />
              <ProductCard product={result.products.productB} type="B" />
            </div>

            {/* Side-by-Side Comparison Matrix */}
            <ComparisonTable
              matrix={result.matrix}
              productA={result.products.productA}
              productB={result.products.productB}
            />

            {/* Verifiable Source Links & Citations */}
            <SourceLinks sources={result.sources} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">
            <strong>CompetitorX</strong> — AI-Powered Website Comparison Agent.
            Built with React, Express, and TinyFish Live Web Agent Infrastructure.
          </p>
          <div className="footer-links">
            <span className="footer-tag">⚡ Live Web Grounded</span>
            <span className="footer-tag">📄 PDF & Markdown Export</span>
            <span className="footer-tag">🛡️ Zero Synthetic Data</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
