const { z } = require('zod');


const currencies = ['ZAR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CNY', 'JPY'];


const swiftRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/; // BIC 8 or 11


const customerRegisterSchema = z.object({
username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_.-]+$/),
fullName: z.string().min(3).max(120),
idNumber: z.string().min(6).max(64), // SA ID often 13 digits; keep generic
accountNumber: z.string().min(6).max(34), // IBAN/accno length range
password: z.string().min(8).max(128),
});


const customerLoginSchema = z.object({
username: z.string(),
accountNumber: z.string(),
password: z.string(),
});


const employeeLoginSchema = z.object({
email: z.string().email(),
password: z.string(),
});


const paymentCreateSchema = z.object({
amount: z.number().positive(),
currency: z.enum(currencies),
provider: z.literal('SWIFT'),
beneficiaryName: z.string().min(2).max(120),
beneficiaryAccountNumber: z.string().min(6).max(34),
beneficiarySwift: z.string().transform((s) => s.toUpperCase()).refine((s) => swiftRegex.test(s), 'Invalid SWIFT/BIC code'),
beneficiaryBankName: z.string().optional(),
note: z.string().max(500).optional(),
});


module.exports = {
currencies,
swiftRegex,
customerRegisterSchema,
customerLoginSchema,
employeeLoginSchema,
paymentCreateSchema,
};