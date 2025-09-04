const router2 = require('express').Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { paymentCreateSchema } = require('../utils/validators');
const Payment = require('../models/Payment');
const AuditLog2 = require('../models/AuditLog');
const Customer2 = require('../models/customer');
const { encrypt } = require('../utils/crypto');
const { paymentToDTO } = require('../utils/mappers');


router2.post('/payments', auth(), requireRole('customer'), async (req, res, next) => {
try {
const parsed = paymentCreateSchema.parse(req.body);
const { amount, currency, provider, beneficiaryName, beneficiaryAccountNumber, beneficiarySwift, beneficiaryBankName, note } = parsed;


const amountCents = Math.round(amount * 100);


const payment = await Payment.create({
customer: req.user.sub,
amountCents,
currency,
provider,
beneficiaryName,
beneficiaryAccountNumberEnc: encrypt(beneficiaryAccountNumber),
beneficiarySwiftEnc: encrypt(beneficiarySwift),
beneficiaryBankName,
note,
status: 'PENDING_REVIEW',
});


await AuditLog2.create({
actorType: 'customer',
actorId: req.user.sub,
action: 'PAYMENT_INITIATED',
targetId: payment._id.toString(),
metadata: { currency, amountCents },
});


res.status(201).json({ payment: paymentToDTO(payment, { role: 'customer' }) });
} catch (err) {
next(err);
}
});


router2.get('/payments/mine', auth(), requireRole('customer'), async (req, res, next) => {
try {
const list = await Payment.find({ customer: req.user.sub }).sort({ createdAt: -1 });
const dto = list.map((p) => paymentToDTO(p, { role: 'customer' }));
res.json({ payments: dto });
} catch (err) {
next(err);
}
});


module.exports = router2;