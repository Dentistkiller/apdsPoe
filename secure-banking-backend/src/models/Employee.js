const mongoose2 = require('mongoose');
const bcrypt2 = require('bcryptjs');


const employeeSchema = new mongoose2.Schema(
{
email: { type: String, required: true, unique: true, index: true },
name: { type: String, required: true },
role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
passwordHash: { type: String, required: true },
},
{ timestamps: true }
);


employeeSchema.methods.comparePassword = async function (plain) {
const pepper = process.env.PEPPER || '';
return bcrypt2.compare(plain + pepper, this.passwordHash);
};


const Employee = mongoose2.model('Employee', employeeSchema);
module.exports = Employee;