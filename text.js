const crypto=require('crypto')
const generateTxRef = () => {
    const bytes = crypto.randomBytes(7);
    return bytes.toString('base64').substring(0, 6);
    }

    console.log(generateTxRef())