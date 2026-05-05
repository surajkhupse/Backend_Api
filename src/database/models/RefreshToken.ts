import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  deviceName: string;
  ipAddress: string;
  /** Updated when the refresh token is used to rotate (new session row replaces old). */
  lastUsedAt: Date;
  createdAt?: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    deviceName: { type: String, default: 'Unknown device' },
    ipAddress: { type: String, default: '' },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

/** Drop expired documents shortly after `expiresAt`. */
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken: Model<IRefreshToken> = mongoose.model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema
);

export default RefreshToken;
