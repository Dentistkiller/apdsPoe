const jwt = require('jsonwebtoken');


const auth = () => (req, res, next) => {
const header = req.headers['authorization'] || '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
if (!token) return res.status(401).json({ message: 'Missing token' });
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload; // { sub, role, type }
next();
} catch (e) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
};


module.exports = { auth };