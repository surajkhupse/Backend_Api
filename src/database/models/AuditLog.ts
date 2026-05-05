import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGIN_LOCKED'
  | 'LOGIN_SSO_SUCCESS';

export interface IAuditLog extends Document {
  action: AuditAction;
  /** Present when the actor maps to a user (successful login, failed password for known account, etc.). */
  user?: Types.ObjectId;
  /** Normalized email when relevant (e.g. unknown-address failure). */
  emailNormalized?: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: {
      type: String,
      required: true,
      enum: ['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGIN_LOCKED', 'LOGIN_SSO_SUCCESS'],
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    emailNormalized: { type: String, index: true },
    ipAddress: { type: String, required: true, default: '' },
    userAgent: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog: Model<IAuditLog> = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog;
