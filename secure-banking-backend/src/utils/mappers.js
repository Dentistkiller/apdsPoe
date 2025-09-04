const { decrypt } = require('./crypto');


function maskAccount(acc) {
if (!acc) return '';
const s = String(acc);
if (s.length <= 4) return '*'.repeat(s.length);
return '*'.repeat(s.length - 4) + s.slice(-4);
}


function paymentToDTO(paymentDoc, opts = { role: 'customer' }) {
const base = {
id: paymentDoc._id.toString(),
amountCents: paymentDoc.amountCents,
currency: paymentDoc.currency,
provider: paymentDoc.provider,
beneficiaryName: paymentDoc.beneficiaryName,
beneficiaryBankName: paymentDoc.beneficiaryBankName || null,
note: paymentDoc.note || null,
status: paymentDoc.status,
createdAt: paymentDoc.createdAt,
verifiedAt: paymentDoc.verifiedAt || null,
submittedAt: paymentDoc.submittedAt || null,
};


const beneficiaryAccount = decrypt(paymentDoc.beneficiaryAccountNumberEnc);
const beneficiarySwift = decrypt(paymentDoc.beneficiarySwiftEnc);


if (opts.role === 'employee') {
return {
...base,
beneficiaryAccountNumber: beneficiaryAccount,
beneficiarySwift,
verifiedBy: paymentDoc.verifiedBy || null,
submittedBy: paymentDoc.submittedBy || null,
};
}
return {
...base,
beneficiaryAccountNumber: maskAccount(beneficiaryAccount),
beneficiarySwift: beneficiarySwift, // visible to customer
};
}


module.exports = { paymentToDTO, maskAccount };