import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Search, Quote, ExternalLink } from 'lucide-react';

export default function ComparisonTable({ matrix, productA, productB }) {
  const [filterText, setFilterText] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  if (!matrix || matrix.length === 0) return null;

  const filteredMatrix = matrix.filter((row) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      row.attribute.toLowerCase().includes(q) ||
      row.category.toLowerCase().includes(q) ||
      row.productA.value.toLowerCase().includes(q) ||
      row.productB.value.toLowerCase().includes(q)
    );
  });

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="comparison-table-section glass-panel">
      <div className="table-header-bar">
        <div className="table-title-group">
          <h3 className="section-title">Side-by-Side Comparison</h3>
          <p className="section-subtitle">
            Grounded comparative matrix highlighting confirmed facts vs unverified disclosures.
          </p>
        </div>

        {/* Filter Input */}
        <div className="table-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Filter attributes (e.g., pricing, developer)..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="table-search-input"
          />
          {filterText && (
            <button
              className="clear-search-btn"
              onClick={() => setFilterText('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="th-attribute">Attribute</th>
              <th className="th-product th-product-a">
                <div className="th-product-header">
                  <span className="th-product-badge">Product A</span>
                  <span className="th-product-name">{productA?.productName || 'Product A'}</span>
                </div>
              </th>
              <th className="th-product th-product-b">
                <div className="th-product-header">
                  <span className="th-product-badge badge-purple">Product B</span>
                  <span className="th-product-name">{productB?.productName || 'Product B'}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMatrix.map((row, index) => {
              const isExpanded = expandedRow === index;
              const hasEvidence = Boolean(row.productA.evidence || row.productB.evidence);

              return (
                <React.Fragment key={index}>
                  <tr
                    className={`table-row ${isExpanded ? 'row-expanded' : ''} ${hasEvidence ? 'clickable-row' : ''}`}
                    onClick={() => hasEvidence && toggleRow(index)}
                  >
                    <td className="td-attribute">
                      <div className="attr-content">
                        <span className="attr-category">{row.category}</span>
                        <strong className="attr-title">{row.attribute}</strong>
                        {hasEvidence && (
                          <span className="evidence-hint">
                            <Quote size={11} /> {isExpanded ? 'Hide Evidence' : 'View Evidence'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Product A Column */}
                    <td className="td-product td-product-a">
                      <div className="cell-content">
                        <div className="cell-value">{renderCellValue(row.productA.value)}</div>
                        <div className="cell-status">
                          {row.productA.status === 'verified' ? (
                            <span className="status-badge status-verified">
                              <CheckCircle2 size={12} /> Confirmed Fact
                            </span>
                          ) : (
                            <span className="status-badge status-not-found">
                              <AlertTriangle size={12} /> Not Found / Unlisted
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Product B Column */}
                    <td className="td-product td-product-b">
                      <div className="cell-content">
                        <div className="cell-value">{renderCellValue(row.productB.value)}</div>
                        <div className="cell-status">
                          {row.productB.status === 'verified' ? (
                            <span className="status-badge status-verified">
                              <CheckCircle2 size={12} /> Confirmed Fact
                            </span>
                          ) : (
                            <span className="status-badge status-not-found">
                              <AlertTriangle size={12} /> Not Found / Unlisted
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Expandable Evidence Drawer */}
                  {isExpanded && (
                    <tr className="evidence-drawer-row">
                      <td colSpan="3" className="evidence-cell">
                        <div className="evidence-drawer-inner">
                          <div className="evidence-column">
                            <div className="evidence-header-tag">
                              <span>Evidence for {productA?.productName}</span>
                              <a
                                href={productA?.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="evidence-link"
                              >
                                Source Page <ExternalLink size={11} />
                              </a>
                            </div>
                            <blockquote className="evidence-quote">
                              {row.productA.evidence || 'No direct excerpt captured for this attribute.'}
                            </blockquote>
                          </div>

                          <div className="evidence-column">
                            <div className="evidence-header-tag">
                              <span>Evidence for {productB?.productName}</span>
                              <a
                                href={productB?.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="evidence-link"
                              >
                                Source Page <ExternalLink size={11} />
                              </a>
                            </div>
                            <blockquote className="evidence-quote">
                              {row.productB.evidence || 'No direct excerpt captured for this attribute.'}
                            </blockquote>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCellValue(value) {
  if (!value) return <span className="muted-text">—</span>;
  if (value.includes(' • ')) {
    const items = value.split(' • ');
    return (
      <div className="cell-pill-list">
        {items.map((item, idx) => (
          <span key={idx} className="cell-item-chip">
            {item}
          </span>
        ))}
      </div>
    );
  }
  return <span>{value}</span>;
}
