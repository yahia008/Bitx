const crypto = require('crypto');


const generateTxRef = () => {
    const bytes = crypto.randomBytes(7);
    return bytes.toString('hex').substring(0, 6);
    }

   
 module.exports = generateTxRef