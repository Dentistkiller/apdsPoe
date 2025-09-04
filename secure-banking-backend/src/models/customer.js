const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { encrypt, decrypt } = require('../utils/crypto');


const customerSchema = new mongoose.Schema(
{
username: { type: String, required: true, unique: true, index: true },
fullName: { type: String, required: true },
idNumberEnc: { type: String, required: true },
idNumberHash: { type: String, required: true, index: true },
accountNumberEnc: { type: String, required: true },
accountNumberHash: { type: String, required: true, index: true },
passwordHash: { type: String, required: true },
},
{ timestamps: true }
);


customerSchema.methods.comparePassword = async function (plain) {
const pepper = process.env.PEPPER || '';
return bcrypt.compare(plain + pepper, this.passwordHash);
};


customerSchema.statics.hashDeterministic = function (value) {
const key = process.env.FIELD_ENCRYPTION_KEY || 'fallback';
return crypto.createHmac('sha256', key).update(String(value)).digest('hex');
};


customerSchema.statics.encryptField = function (value) {
return encrypt(String(value));
};


customerSchema.statics.decryptField = function (enc) {
return decrypt(enc);
};


customerSchema.pre('save', async function (next) {
if (this.isModified('passwordHash')) return next(); // never set directly
next();
});


const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;