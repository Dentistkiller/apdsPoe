const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt2 = require('jsonwebtoken');
const { authLimiter } = require('../middleware/ratelimiter');
const Customer = require('../models/customer');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');
const {
customerRegisterSchema,
customerLoginSchema,
employeeLoginSchema,
} = require('../utils/validators');

router.post('/customers/register', authLimiter, async (req, res, next) => {
    try {
    // NOTE: The spec requires username at login, so we include it at registration
    const parsed = customerRegisterSchema.parse(req.body);
    const { username, fullName, idNumber, accountNumber, password } = parsed;
    
    
    const exists = await Customer.findOne({ $or: [{ username }, { accountNumberHash: Customer.hashDeterministic(accountNumber) }] });
    if (exists) return res.status(409).json({ message: 'Username or account number already registered' });
    
    
    const saltRounds = Number(process.env.BCRYPT_COST || 12);
    const salt = await bcrypt.genSalt(saltRounds);
    const pepper = process.env.PEPPER || '';
    const passwordHash = await bcrypt.hash(password + pepper, salt);
    
    
    const idNumberEnc = Customer.encryptField(idNumber);
    const idNumberHash = Customer.hashDeterministic(idNumber);
    const accountNumberEnc = Customer.encryptField(accountNumber);
    const accountNumberHash = Customer.hashDeterministic(accountNumber);
    
    
    const customer = await Customer.create({
    username,
    fullName,
    idNumberEnc,
    idNumberHash,
    accountNumberEnc,
    accountNumberHash,
    passwordHash,
    });
    
    
    await AuditLog.create({
    actorType: 'customer',
    actorId: customer._id.toString(),
    action: 'CUSTOMER_REGISTERED',
    targetId: customer._id.toString(),
    });
    
    
    res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
    next(err);
    }
});

router.post('/customers/login', authLimiter, async (req, res, next) => {
    try {
    const { username, accountNumber, password } = customerLoginSchema.parse(req.body);
    const accountNumberHash = Customer.hashDeterministic(accountNumber);
    const customer = await Customer.findOne({ username, accountNumberHash });
    if (!customer) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await customer.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    
    
    const token = jwt2.sign({ sub: customer._id.toString(), type: 'customer' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    
    
    await AuditLog.create({
    actorType: 'customer',
    actorId: customer._id.toString(),
    action: 'CUSTOMER_LOGGED_IN',
    });
    
    
    res.json({ token, user: { id: customer._id, username: customer.username, fullName: customer.fullName, type: 'customer' } });
    } catch (err) {
    next(err);
    }
});
    
    
router.post('/employees/login', authLimiter, async (req, res, next) => {
    try {
    const { email, password } = employeeLoginSchema.parse(req.body);
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await employee.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    
    
    const token = jwt2.sign({ sub: employee._id.toString(), type: 'employee', role: employee.role }, process.env.JWT_SECRET, { expiresIn: '4h' });
    
    
    await AuditLog.create({
    actorType: 'employee',
    actorId: employee._id.toString(),
    action: 'EMPLOYEE_LOGGED_IN',
    });
    
    
    res.json({ token, user: { id: employee._id, email: employee.email, name: employee.name, role: employee.role, type: 'employee' } });
    } catch (err) {
    next(err);
    }
});
    
    
module.exports = router;

