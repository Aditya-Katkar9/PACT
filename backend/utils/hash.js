const crypto = require('crypto');

function generateCIH({ agreementText, partyAHash, partyBHash, timestamp, deviceFingerprint }) {
    const dataString = `${agreementText}${partyAHash}${partyBHash}${timestamp}${deviceFingerprint}`;
    return crypto.createHash('sha256').update(dataString).digest('hex');
}

module.exports = { generateCIH };
