const crypto2 = require('crypto');


const ALGO = 'aes-256-gcm';


function getKey() {
const raw = process.env.FIELD_ENCRYPTION_KEY || 'fallback_key_must_be_32_bytes_after_hash';
return crypto2.createHash('sha256').update(raw).digest();
}


function encrypt(plainText) {
const key = getKey();
const iv = crypto2.randomBytes(12);
const cipher = crypto2.createCipheriv(ALGO, key, iv);
const enc = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();
return Buffer.concat([iv, tag, enc]).toString('base64');
}


function decrypt(payloadB64) {
const key = getKey();
const buf = Buffer.from(payloadB64, 'base64');
const iv = buf.slice(0, 12);
const tag = buf.slice(12, 28);
const data = buf.slice(28);
const decipher = crypto2.createDecipheriv(ALGO, key, iv);
decipher.setAuthTag(tag);
const dec = Buffer.concat([decipher.update(data), decipher.final()]);
return dec.toString('utf8');
}


module.exports = { encrypt, decrypt };