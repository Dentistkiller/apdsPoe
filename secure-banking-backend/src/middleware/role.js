const requireRole = (expected) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
    if (expected === 'employee' && req.user.type !== 'employee') {
    return res.status(403).json({ message: 'Employees only' });
    }
    if (expected === 'customer' && req.user.type !== 'customer') {
    return res.status(403).json({ message: 'Customers only' });
    }
    next();
    };
    
    
    module.exports = { requireRole };