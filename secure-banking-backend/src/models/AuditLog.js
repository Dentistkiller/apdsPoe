const mongoose4 = require('mongoose');


const auditLogSchema = new mongoose4.Schema(
{
actorType: { type: String, enum: ['customer', 'employee', 'system'], required: true },
actorId: { type: String }, // store as string to allow both ObjectIds and literals
action: { type: String, required: true },
targetId: { type: String },
metadata: { type: Object },
},
{ timestamps: true }
);


const AuditLog = mongoose4.model('AuditLog', auditLogSchema);
module.exports = AuditLog;