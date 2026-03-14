const PDFDocument = require('pdfkit');

function createAgreementPDF(agreement) {
    const doc = new PDFDocument({ margin: 50 });

    // Header Title
    doc.fillColor('#0B3D91').fontSize(24).text('PACT', { align: 'center' });
    doc.fillColor('#333333').fontSize(12).text('Predictive AI-Backed Commitment Technology', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(20).text('Agreement Certificate', { align: 'center', underline: true });
    doc.moveDown(2);

    // Agreement Details
    doc.fontSize(14).font('Helvetica-Bold').text('Agreement Details');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Title: ${agreement.title}`);
    doc.text(`Description: ${agreement.description}`);
    doc.text(`Type: ${agreement.agreementType.charAt(0).toUpperCase() + agreement.agreementType.slice(1)}`);
    if (agreement.amount) doc.text(`Amount: $${agreement.amount}`);
    if (agreement.location) doc.text(`Location: ${agreement.location}`);
    doc.text(`Due Date: ${new Date(agreement.dueDate).toLocaleDateString()}`);
    doc.moveDown(1.5);

    // Parties
    doc.fontSize(14).font('Helvetica-Bold').text('Parties Involved');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Party A: ${agreement.partyAName} (${agreement.partyAEmail})`);
    doc.text(`Party B: ${agreement.partyBName} (${agreement.partyBEmail})`);
    doc.moveDown(1.5);

    // Verification & Status
    doc.fontSize(14).font('Helvetica-Bold').text('Verification Status');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Status: ${agreement.status}`);
    doc.text(`Party A Biometric Verification: ${agreement.partyAVerified ? 'Verified' : 'Pending'}`);
    doc.text(`Party B Biometric Verification: ${agreement.partyBVerified ? 'Verified' : 'Pending'}`);
    doc.text(`Timestamp: ${new Date(agreement.updatedAt || agreement.createdAt).toISOString()}`);
    doc.moveDown(1.5);

    // CIH Hash
    doc.fillColor('#0B3D91').fontSize(14).font('Helvetica-Bold').text('Commitment Integrity Hash (CIH)');
    doc.moveDown(0.5);
    doc.fillColor('#000000').fontSize(10).font('Courier').text(agreement.cihHash || 'Pending Verification', {
        width: 410,
        align: 'left'
    });

    return doc;
}

module.exports = { createAgreementPDF };
