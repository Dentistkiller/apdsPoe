const mongoose3 = require('mongoose');
const { encrypt } = require('../utils/crypto');


const paymentSchema = new mongoose3.Schema(
{
customer: { type: mongoose3.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
amountCents: { type: Number, required: true, min: 1 },
currency: { type: String, required: true }, // e.g., ZAR, USD
provider: { type: String, enum: ['SWIFT'], required: true },


beneficiaryName: { type: String, required: true },
beneficiaryAccountNumberEnc: { type: String, required: true },
beneficiarySwiftEnc: { type: String, required: true },
beneficiaryBankName: { type: String },
note: { type: String },


status: { type: String, enum: ['PENDING_REVIEW', 'VERIFIED', 'SUBMITTED'], default: 'PENDING_REVIEW', index: true },


verifiedBy: { type: mongoose3.Schema.Types.ObjectId, ref: 'Employee' },
verifiedAt: { type: Date },
verificationNote: { type: String },


submittedBy: { type: mongoose3.Schema.Types.ObjectId, ref: 'Employee' },
submittedAt: { type: Date },
},
{ timestamps: true }
);


const Payment = mongoose3.model('Payment', paymentSchema);
module.exports = Payment;