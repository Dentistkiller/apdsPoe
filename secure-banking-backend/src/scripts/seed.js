const dotenv2 = require('dotenv');
const bcrypt3 = require('bcryptjs');
const { connectDB } = require('../config/db');
const Employee = require('../models/Employee');


dotenv2.config();


(async () => {
try {
await connectDB();
const email = process.env.EMPLOYEE_DEFAULT_EMAIL || 'ops@bank.local';
const name = process.env.EMPLOYEE_DEFAULT_NAME || 'Ops User';
const pwd = process.env.EMPLOYEE_DEFAULT_PASSWORD || 'ChangeMe!123';


const existing = await Employee.findOne({ email });
if (existing) {
console.log('Employee already exists:', email);
process.exit(0);
}


const saltRounds = Number(process.env.BCRYPT_COST || 12);
const salt = await bcrypt3.genSalt(saltRounds);
const pepper = process.env.PEPPER || '';
const passwordHash = await bcrypt3.hash(pwd + pepper, salt);


await Employee.create({ email, name, role: 'employee', passwordHash });
console.log('Seeded employee:', email);
process.exit(0);
} catch (e) {
console.error(e);
process.exit(1);
}
})();