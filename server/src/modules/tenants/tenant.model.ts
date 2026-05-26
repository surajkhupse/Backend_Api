import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type TenantStatus = "active" | "inactive" | "suspended";

export interface ITenant extends Document {
  name: string;
  slug: string;
  domain?: string;
  status: TenantStatus;
  owner: Types.ObjectId;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    domain: { type: String, sparse: true, unique: true },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      required: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const Tenant: Model<ITenant> = mongoose.model<ITenant>('Tenant', tenantSchema);

export default Tenant;  