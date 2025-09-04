const router3 = require('express').Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const Payment2 = require('../models/Payment');
const AuditLog3 = require('../models/AuditLog');
const { swiftRegex } = require('../utils/validators');
const { decrypt } = require('../utils/crypto');
const { paymentToDTO } = require('../utils/mappers');

// List payments for international portal (employee view)
router3.get('/admin/payments', auth(), requireRole('employee'), async (req, res, next) => {
    try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const list = await Payment2.find(query).sort({ createdAt: -1 });
    res.json({ payments: list.map((p) => paymentToDTO(p, { role: 'employee' })) });
    } catch (err) { next(err); }
});
    
    
    // Verify payment (check SWIFT format, mark as VERIFIED)
router3.patch('/admin/payments/:id/verify', auth(), requireRole('employee'), async (req, res, next) => {
    try {
    const payment = await Payment2.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'PENDING_REVIEW') return res.status(400).json({ message: 'Only PENDING_REVIEW can be verified' });
    
    
    const swift = decrypt(payment.beneficiarySwiftEnc).toUpperCase();
    if (!swiftRegex.test(swift)) return res.status(400).json({ message: 'Invalid SWIFT/BIC code format' });
    
    
    payment.status = 'VERIFIED';
    payment.verifiedBy = req.user.sub;
    payment.verifiedAt = new Date();
    payment.verificationNote = req.body?.note || undefined;
    await payment.save();
    
    
    await AuditLog3.create({
    actorType: 'employee',
    actorId: req.user.sub,
    action: 'PAYMENT_VERIFIED',
    targetId: payment._id.toString(),
});
    
    
res.json({ payment: paymentToDTO(payment, { role: 'employee' }) });
    } catch (err) { next(err); }
});
    
    
    // Submit to SWIFT (stub) – sets status SUBMITTED, records timestamp
router3.patch('/admin/payments/:id/submit', auth(), requireRole('employee'), async (req, res, next) => {
    try {
    const payment = await Payment2.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'VERIFIED') return res.status(400).json({ message: 'Only VERIFIED can be submitted' });
    
    
    // Here you would normally call an external service / queue
    payment.status = 'SUBMITTED';
    payment.submittedBy = req.user.sub;
    payment.submittedAt = new Date();
    await payment.save();
    
    
    await AuditLog3.create({
    actorType: 'employee',
    actorId: req.user.sub,
    action: 'PAYMENT_SUBMITTED_TO_SWIFT',
    targetId: payment._id.toString(),
});
    
    
res.json({ payment: paymentToDTO(payment, { role: 'employee' }) });
    } catch (err) { next(err); }
});
    
    
module.exports = router3;