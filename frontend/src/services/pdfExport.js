import { jsPDF } from 'jspdf';

/**
 * Generates an executive, professional PDF comparison report for CompetitorX
 */
export function exportComparisonPdf(result) {
  if (!result || !result.products) return;

  const { products, matrix, recommendation, meta } = result;
  const pA = products.productA;
  const pB = products.productB;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper for checking page overflow and adding a new page
  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = margin;
      drawPageHeaderCompact();
      return true;
    }
    return false;
  };

  const drawPageHeaderCompact = () => {
    doc.setFillColor(11, 17, 32);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 242, 254);
    doc.text('COMPETITORX INTELLIGENCE REPORT', margin + 4, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`${pA.productName} vs ${pB.productName}`, pageWidth - margin - 4, y + 5.5, { align: 'right' });
    y += 12;
  };

  // ----------------------------------------------------
  // COVER / MAIN HEADER BLOCK
  // ----------------------------------------------------
  doc.setFillColor(11, 17, 32);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');

  // Cyan accent line
  doc.setFillColor(0, 242, 254);
  doc.rect(margin, y, contentWidth, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('COMPETITORX', margin + 6, y + 10);

  doc.setFontSize(9);
  doc.setTextColor(0, 242, 254);
  doc.text('AI-POWERED WEBSITE COMPARISON & EVIDENCE REPORT', margin + 6, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin + 6, y + 23);
  doc.text(`Provider: ${meta.provider === 'tinyfish' ? 'TinyFish Cloud Web Agent' : 'Live Web Agent'} (100% Grounded)`, margin + 6, y + 28);

  doc.text(`Target A: ${pA.productName} (${pA.sourceUrl})`, pageWidth - margin - 6, y + 23, { align: 'right' });
  doc.text(`Target B: ${pB.productName} (${pB.sourceUrl})`, pageWidth - margin - 6, y + 28, { align: 'right' });

  y += 38;

  // ----------------------------------------------------
  // AI RECOMMENDATION & VERDICT BLOCK
  // ----------------------------------------------------
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(196, 181, 253);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(109, 40, 217);
  doc.text('AI COMPETITIVE VERDICT & SELECTION', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Evaluation Lens: "${recommendation.requirement || 'General Fit'}"`, pageWidth - margin - 5, y + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`Recommended: ${recommendation.winner} (${recommendation.winnerScore} / 10)`, margin + 5, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(recommendation.headline, margin + 5, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const summaryLines = doc.splitTextToSize(recommendation.summary, contentWidth - 10);
  doc.text(summaryLines, margin + 5, y + 25);

  // Scores footer inside card
  const scoreAY = y + 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `${pA.productName}: ${recommendation.scores[pA.productName]?.score || 7.0}/10 (Confidence: ${pA.confidenceScore}%)  |  ` +
    `${pB.productName}: ${recommendation.scores[pB.productName]?.score || 7.0}/10 (Confidence: ${pB.confidenceScore}%)`,
    margin + 5,
    scoreAY
  );

  y += 48;

  // ----------------------------------------------------
  // STRUCTURED COMPARISON MATRIX TABLE
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Side-by-Side Comparison Matrix', margin, y);
  y += 5;

  // Table header
  const colAttrWidth = 44;
  const colDataWidth = (contentWidth - colAttrWidth) / 2;

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ATTRIBUTE', margin + 3, y + 4.8);
  doc.text(`PRODUCT A: ${pA.productName.toUpperCase()}`, margin + colAttrWidth + 3, y + 4.8);
  doc.text(`PRODUCT B: ${pB.productName.toUpperCase()}`, margin + colAttrWidth + colDataWidth + 3, y + 4.8);

  y += 7;

  // Table Rows
  matrix.forEach((row, index) => {
    const isEven = index % 2 === 0;
    const cleanAttr = `${row.attribute}\n[${row.category}]`;
    const cleanValA = formatPdfCell(row.productA.value, row.productA.status);
    const cleanValB = formatPdfCell(row.productB.value, row.productB.status);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    const linesAttr = doc.splitTextToSize(cleanAttr, colAttrWidth - 5);
    const linesA = doc.splitTextToSize(cleanValA, colDataWidth - 5);
    const linesB = doc.splitTextToSize(cleanValB, colDataWidth - 5);

    const maxLines = Math.max(linesAttr.length, linesA.length, linesB.length);
    const rowHeight = Math.max(9, maxLines * 3.5 + 4);

    checkPageBreak(rowHeight);

    // Row Background
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    // Border bottom
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    // Attribute
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(linesAttr, margin + 3, y + 4);

    // Product A
    doc.setFont('helvetica', 'normal');
    if (row.productA.status === 'verified') {
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setTextColor(180, 83, 9); // Amber for not found
    }
    doc.text(linesA, margin + colAttrWidth + 3, y + 4);

    // Product B
    if (row.productB.status === 'verified') {
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setTextColor(180, 83, 9);
    }
    doc.text(linesB, margin + colAttrWidth + colDataWidth + 3, y + 4);

    y += rowHeight;
  });

  y += 8;

  // ----------------------------------------------------
  // VERIFIABLE SOURCE EVIDENCE SECTION
  // ----------------------------------------------------
  checkPageBreak(35);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Verifiable Evidence & Source Citations', margin, y);
  y += 5;

  const sources = result.sources || [];
  sources.forEach((src) => {
    checkPageBreak(25);

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${src.product}  —  ${src.url}`, margin + 3, y + 4.2);
    doc.text(`Confidence: ${src.confidence}`, pageWidth - margin - 3, y + 4.2, { align: 'right' });
    y += 7;

    (src.citations || []).slice(0, 3).forEach((cite) => {
      const citeText = `• [${cite.claim}] ${cite.finding} ${cite.evidence ? `— Quote: ${cite.evidence}` : ''}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(51, 65, 85);
      const citeLines = doc.splitTextToSize(citeText, contentWidth - 6);
      const citeH = citeLines.length * 3.2 + 2;

      checkPageBreak(citeH);
      doc.text(citeLines, margin + 4, y + 3);
      y += citeH;
    });

    y += 4;
  });

  // ----------------------------------------------------
  // ADD PAGE NUMBERS TO ALL PAGES
  // ----------------------------------------------------
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `CompetitorX AI Agent | Grounded Competitive Intelligence | Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // ----------------------------------------------------
  // TRIGGER DOWNLOAD
  // ----------------------------------------------------
  const cleanA = pA.productName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const cleanB = pB.productName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const filename = `competitorx-${cleanA}-vs-${cleanB}.pdf`;
  doc.save(filename);
}

function formatPdfCell(val, status) {
  if (!val) return '—';
  let formatted = val.replace(/ • /g, '\n• ');
  if (status === 'not_found') {
    formatted = `[NOT DISCLOSED]\n${formatted}`;
  } else if (status === 'verified') {
    formatted = `[CONFIRMED]\n${formatted}`;
  }
  return formatted;
}
