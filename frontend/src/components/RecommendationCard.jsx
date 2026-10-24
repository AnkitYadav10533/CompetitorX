import React from 'react';
import { Award, Sparkles, TrendingUp, CheckCircle, Target } from 'lucide-react';

export default function RecommendationCard({ recommendation, productA, productB }) {
  if (!recommendation) return null;

  const { winner, winnerScore, requirement, headline, summary, scores } = recommendation;

  return (
    <div className="recommendation-card glass-panel glow-card">
      <div className="rec-badge-row">
        <div className="rec-pill">
          <Sparkles size={14} className="accent-icon" />
          <span>AI-Powered Competitive Verdict</span>
        </div>
        <div className="lens-pill">
          <Target size={13} />
          <span>Requirement: <strong>{requirement}</strong></span>
        </div>
      </div>

      <div className="rec-main-content">
        <div className="rec-left">
          <div className="winner-tag">Recommended Selection</div>
          <h2 className="winner-name">
            <Award size={32} className="winner-trophy" />
            <span>{winner}</span>
            <span className="winner-score-badge">{winnerScore} / 10</span>
          </h2>
          <h4 className="rec-headline">{headline}</h4>
          <p className="rec-summary">{summary}</p>
        </div>

        <div className="rec-right">
          <div className="score-breakdown-box">
            <h5 className="breakdown-title">
              <TrendingUp size={14} /> Evaluation Breakdown
            </h5>
            <div className="product-scores-grid">
              {Object.entries(scores || {}).map(([pName, data], idx) => {
                const isWinner = pName === winner;
                return (
                  <div
                    key={idx}
                    className={`product-score-card ${isWinner ? 'winner-box' : 'regular-box'}`}
                  >
                    <div className="score-card-header">
                      <span className="score-pname">{pName}</span>
                      <span className={`score-digit ${isWinner ? 'winner-digit' : ''}`}>
                        {data.score} <small>/ 10</small>
                      </span>
                    </div>
                    <div className="score-confidence">
                      Grounding Confidence: <strong>{data.confidence}</strong>
                    </div>
                    <ul className="score-strengths-list">
                      {data.strengths.map((str, sIdx) => (
                        <li key={sIdx}>
                          <CheckCircle size={12} className="strength-icon" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
