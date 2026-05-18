import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  /** Local sign-in; omitted for Google-only accounts */
  password?: string;
  /** Google OIDC `sub` — set when the user has signed in with Google SSO */
  googleSub?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  /** Consecutive failed password logins (reset on success or after lock expires). */
  failedLoginAttempts?: number;
  /** When set and in the future, password login is blocked. */
  lockUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleSub: { type: String, required: false, sparse: true, unique: true },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('validate', function () {
  const hasPassword = typeof this.password === 'string' && this.password.length > 0;
  const hasGoogle = typeof this.googleSub === 'string' && this.googleSub.length > 0;
  if (!hasPassword && !hasGoogle) {
    this.invalidate('password', 'Either password or Google SSO is required');
  }
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
