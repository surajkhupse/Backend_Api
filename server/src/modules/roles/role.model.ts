import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IRole extends Document {
  name: string;
  slug: string;
  tenant?: Types.ObjectId;
  permissions: string[];
  isSystem: boolean;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', default: null },
    permissions: [{ type: String }],
    isSystem: { type: Boolean, default: false },
    description: { type: String },
  },
  { timestamps: true }
);

roleSchema.index({ tenant: 1, slug: 1 }, { unique: true });

const Role: Model<IRole> = mongoose.model<IRole>('Role', roleSchema);

export default Role;