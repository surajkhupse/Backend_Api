import { Request, Response } from "express";
import { reply } from "../../utils/response";
import User from "../users/user.model";
import { createTenant, listTenants, getTenant, updateTenantStatus, deleteTenant } from "./tenant.service";
import { TenantStatus } from "./tenant.model";
import type { UserRole } from "../users/user.model";

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
}

export const create = async (req: Request, res: Response): Promise<Response | void> => {
   try {
    const { name, domain, status, ownerEmail, ownerId } = req.body as {
      name?: string;
      domain?: string;
      status?: string;
      ownerEmail?: string;
      ownerId?: string;
    };

    const trimmedName = name?.trim();
    if (!trimmedName) {
        return reply(res, 400, "Name is required");
    }

    if (status && !["active", "inactive", "suspended"].includes(status)) {
      return reply(res, 400, "Invalid status");
    }

    const authRole = req.authRole as UserRole | undefined;
    let resolvedOwnerId = req.authUserId!;

    if (ownerEmail?.trim() || ownerId?.trim()) {
      if (authRole !== "superadmin") {
        return reply(res, 403, "Only superadmin can assign a tenant owner");
      }
      if (ownerEmail?.trim()) {
        const owner = await User.findOne({ email: ownerEmail.trim().toLowerCase() });
        if (!owner) {
          return reply(res, 404, "Owner user not found for that email");
        }
        if (owner.role === "superadmin") {
          return reply(res, 400, "Superadmin cannot be assigned as tenant owner");
        }
        resolvedOwnerId = owner._id;
      } else if (ownerId?.trim()) {
        const owner = await User.findById(ownerId.trim());
        if (!owner) {
          return reply(res, 404, "Owner user not found");
        }
        if (owner.role === "superadmin") {
          return reply(res, 400, "Superadmin cannot be assigned as tenant owner");
        }
        resolvedOwnerId = owner._id;
      }
    } else if (authRole === "superadmin") {
      return reply(
        res,
        400,
        "Superadmin must provide ownerEmail (or ownerId) for the tenant owner",
      );
    }

    const tenant = await createTenant({
      name: trimmedName,
      ownerId: resolvedOwnerId,
      status: (status as TenantStatus | undefined) ?? "active",
      domain: domain?.trim() || undefined,
    });
    return reply(res, 201, "Tenant created", { tenant });
   } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return reply(res, 409, "Tenant name or domain already exists");
    }
    return reply(res, 500, errorMessage(error));
   }
}

export const list = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const tenants = await listTenants();
        return reply(res, 200, "Tenants listed", { tenants });
    } catch (error) {
        return reply(res, 500, errorMessage(error));
    }
}

export const getById = async (req: Request, res: Response) => {
    try {
        const tenant = await getTenant(req.params.id as string);
        if(!tenant) { return reply(res, 404, "Tenant not found"); }
        return reply(res, 200, "Tenant found", { tenant });
    } catch (error) {
        return reply(res, 500, errorMessage(error));
    }
}

export const changedStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body as { status? : string};
        if(!status || !['active', 'inactive', 'suspended'].includes(status)) {
            return reply(res, 400, "Invalid status");
        }
        const tenant = await updateTenantStatus(req.params.id as string, status as TenantStatus);
        if(!tenant) { return reply(res, 404, "Tenant not found"); }
        return reply(res, 200, "Tenant status changed", { tenant });
    } catch (error) {
        return reply(res, 500, errorMessage(error));
    }
}

export const deleteById = async (req: Request, res: Response) => {
    try {
        const tenant = await deleteTenant(req.params.id as string);
        if(!tenant) { return reply(res, 404, "Tenant not found"); }
        return reply(res, 200, "Tenant deleted", { tenant });
    } catch (error) {
        return reply(res, 500, errorMessage(error));
    }
}
