const express = require('express');
const Agreement = require('../models/Agreement');
const { generateCIH } = require('../utils/hash');
const { createAgreementPDF } = require('../utils/pdfGenerator');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const agreement = new Agreement(req.body);
        await agreement.save();
        res.status(201).json(agreement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const email = req.query.email; // get agreements linked to user email
        if (!email) {
            const all = await Agreement.find().sort({ createdAt: -1 });
            return res.json(all);
        }
        const agreements = await Agreement.find({
            $or: [{ partyAEmail: email }, { partyBEmail: email }]
        }).sort({ createdAt: -1 });
        res.json(agreements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const agreement = await Agreement.findById(req.params.id);
        if (!agreement) return res.status(404).json({ error: 'Not found' });
        res.json(agreement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/verify', async (req, res) => {
    try {
        const { party, hash } = req.body; // party: 'A' or 'B', hash is the face embedding hash
        const agreement = await Agreement.findById(req.params.id);
        if (!agreement) return res.status(404).json({ error: 'Not found' });

        if (party === 'A') agreement.partyAVerified = true;
        if (party === 'B') agreement.partyBVerified = true;

        if (agreement.partyAVerified && agreement.partyBVerified) {
            agreement.status = 'Verified';
            agreement.cihHash = generateCIH({
                agreementText: agreement.description,
                partyAHash: party === 'A' ? hash : 'dummyA', // simplified for demo
                partyBHash: party === 'B' ? hash : 'dummyB',
                timestamp: new Date().toISOString(),
                deviceFingerprint: req.headers['user-agent'] || 'unknown-device'
            });
        }

        await agreement.save();
        res.json(agreement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/pdf', async (req, res) => {
    try {
        const agreement = await Agreement.findById(req.params.id);
        if (!agreement) return res.status(404).json({ error: 'Not found' });

        // Set headers to trigger file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=PACT_Agreement_${agreement._id}.pdf`);

        const doc = createAgreementPDF(agreement);
        doc.pipe(res);
        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
