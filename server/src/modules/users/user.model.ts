import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type UserRole = "superadmin" | "tenant_admin" | "member" | "viewer";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleSub?: string;
  tenant?: Types.ObjectId;
  isActive: boolean;
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
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant", default: null },
    isActive: { type: Boolean, default: true },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    role: {
      type: String,
      enum: ["superadmin", "tenant_admin", "member", "viewer"],
      default: "member",
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.pre('validate', function () {
  const hasPassword = typeof this.password === 'string' && this.password.length > 0;
  const hasGoogle = typeof this.googleSub === 'string' && this.googleSub.length > 0;
  if (!hasPassword && !hasGoogle) {
    this.invalidate('password', 'Either password or Google SSO is required');
  }
});

userSchema.index({ tenant: 1, email: 1 });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
