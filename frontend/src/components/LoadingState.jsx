import React, { useState, useEffect } from 'react';
import { Cpu, Globe, Search, Database, CheckCircle, ShieldCheck } from 'lucide-react';

const STEPS = [
  { icon: Globe, label: 'Validating competitor URLs & network connectivity...' },
  { icon: Search, label: 'Connecting to TinyFish Web Agent API for headless browser extraction...' },
  { icon: Database, label: 'Normalizing page structure & token-efficient markdown conversion...' },
  { icon: Cpu, label: 'Extracting pricing models, tiers, services, and target personas...' },
  { icon: ShieldCheck, label: 'Grounding claims with verifiable source evidence quotes...' },
  { icon: CheckCircle, label: 'Synthesizing side-by-side comparison matrix and AI recommendation...' },
];

export default function LoadingState({ urlA, urlB }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-state-wrapper glass-panel">
      <div className="radar-scanner">
        <div className="scanner-circle circle-1"></div>
        <div className="scanner-circle circle-2"></div>
        <div className="scanner-circle circle-3"></div>
        <div className="radar-sweep"></div>
        <div className="scanner-center-icon">
          <Cpu size={28} className="pulse-icon" />
        </div>
      </div>

      <div className="loading-content">
        <h3 className="loading-title">CompetitorX Agent is Researching</h3>
        <p className="loading-targets">
          <span className="target-pill">{urlA}</span>
          <span className="target-vs">vs</span>
          <span className="target-pill">{urlB}</span>
        </p>

        <div className="agent-timeline">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isDone = index < activeStep;
            const isCurrent = index === activeStep;

            return (
              <div
                key={index}
                className={`timeline-item ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="timeline-node">
                  {isDone ? (
                    <CheckCircle size={16} className="node-icon icon-success" />
                  ) : (
                    <Icon size={16} className={`node-icon ${isCurrent ? 'icon-spin' : 'icon-muted'}`} />
                  )}
                </div>
                <div className="timeline-text">
                  <span className="timeline-label">{step.label}</span>
                  {isCurrent && <span className="running-indicator">Working...</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
