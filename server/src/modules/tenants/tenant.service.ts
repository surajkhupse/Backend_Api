import Tenant, { TenantStatus } from "./tenant.model";
import User from "../users/user.model";
import { Types } from "mongoose";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTenant(name : string, ownerId : Types.ObjectId | string, status : TenantStatus = "active", settings : Record<string, unknown> = {} ){
    const slug = slugify(name);
    const tenant = await Tenant.create({    
        name,
        slug,
        owner: ownerId,
        status,
        settings,
    });

    await User.findByIdAndUpdate(ownerId, { tenant: tenant._id , role: "tenant_admin"}, { new: true });

    return tenant;
}

export async function listTenants() {
  return Tenant.find().sort({ createdAt: -1 }).lean();    
}

export async function getTenant(id : Types.ObjectId | string) {
    return Tenant.findById(id).lean();
}

export async function updateTenantStatus(id : Types.ObjectId | string, status : TenantStatus) {
    return Tenant.findByIdAndUpdate(id, { status }, { new: true }).lean();
}

export async function deleteTenant(id : Types.ObjectId | string) {
    const tenant = await Tenant.findByIdAndDelete(id).lean();
    if (!tenant) {
        throw new Error("Tenant not found");
    }
    await User.findByIdAndUpdate(tenant.owner, { tenant: null, role: "member" }, { new: true });
    return tenant;
}

export async function getTenantBySlug(slug : string) {
    return Tenant.findOne({ slug }).lean();
}