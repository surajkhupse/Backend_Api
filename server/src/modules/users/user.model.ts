import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserRole = 'user' | 'organizer' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleSub?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  failedLoginAttempts?: number;
  lockUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  role: UserRole;
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
    role: {
      type: String,
      enum: ['user', 'organizer', 'admin'],
      default: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('validate', function () {
  const hasPassword =
    typeof this.password === 'string' && this.password.length > 0;
  const hasGoogle =
    typeof this.googleSub === 'string' && this.googleSub.length > 0;
  if (!hasPassword && !hasGoogle) {
    this.invalidate('password', 'Either password or Google SSO is required');
  }
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
