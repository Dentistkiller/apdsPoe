const rateLimit = require('express-rate-limit');


const generalLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 300,
standardHeaders: true,
legacyHeaders: false,
});


const authLimiter = rateLimit({
windowMs: 10 * 60 * 1000,
max: 30,
standardHeaders: true,
legacyHeaders: false,
});


module.exports = { generalLimiter, authLimiter };