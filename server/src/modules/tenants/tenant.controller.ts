import { NextFunction, Request, Response } from "express";
import { reply } from "../../utils/response";
import User from "../users/user.model";
import { createTenant, listTenants, getTenant, updateTenantStatus, deleteTenant } from "./tenant.service";
import { TenantStatus } from "./tenant.model";
import type { UserRole } from "../users/user.model";
import { hashPassword } from "../../utils/bcrypt";
import { isStrongPassword, PASSWORD_RULE_MESSAGE } from "../../utils/password";
import { findUserByEmail, normalizeEmail } from "../users/user.service";
import { getClientIp, issueTokenPair } from "../auth/auth.service";

export const create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
   try {
    const { name, domain, status, ownerEmail, ownerId, password, confirmPassword } = req.body as {
      name?: string;
      domain?: string;
      status?: string;
      ownerEmail?: string;
      ownerId?: string;
      password?: string;
      confirmPassword?: string;
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
    if (authRole !== "superadmin" && (password?.trim() || confirmPassword?.trim())) {
      return reply(res, 403, "Only superadmin can set owner credentials");
    }

    if (ownerEmail?.trim() || ownerId?.trim()) {
      if (authRole !== "superadmin") {
        return reply(res, 403, "Only superadmin can assign a tenant owner");
      }
      if (ownerEmail?.trim()) {
        const normalizedOwnerEmail = normalizeEmail(ownerEmail);
        if (!normalizedOwnerEmail) {
          return reply(res, 400, "Owner email is invalid");
        }

        const existingOwner = await findUserByEmail(normalizedOwnerEmail);
        if (existingOwner) {
          return reply(res, 409, "Owner user already exists for that email");
        }

        const trimmedPassword = password?.trim() ?? "";
        const trimmedConfirmPassword = confirmPassword?.trim() ?? "";
        if (!trimmedPassword || !trimmedConfirmPassword) {
          return reply(res, 422, PASSWORD_RULE_MESSAGE);
        }
        if (!isStrongPassword(trimmedPassword)) {
          return reply(res, 422, PASSWORD_RULE_MESSAGE);
        }
        if (trimmedPassword !== trimmedConfirmPassword) {
          return reply(res, 422, PASSWORD_RULE_MESSAGE);
        }

        const hashedPassword = await hashPassword(trimmedPassword);
        const owner = await User.create({
          name: `${trimmedName} Admin`,
          email: normalizedOwnerEmail,
          password: hashedPassword,
          role: "member",
        });
        resolvedOwnerId = owner._id;
      } else if (ownerId?.trim()) {
        if (password?.trim() || confirmPassword?.trim()) {
          return reply(res, 400, "Password fields are only allowed with ownerEmail");
        }
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
    return next(error);
   }
}

export const list = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const tenants = await listTenants();
        return reply(res, 200, "Tenants listed", { tenants });
    } catch (error) {
        return next(error);
    }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenant = await getTenant(req.params.id as string);
        if(!tenant) { return reply(res, 404, "Tenant not found"); }
        return reply(res, 200, "Tenant found", { tenant });
    } catch (error) {
        return next(error);
    }
}

export const changedStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body as { status? : string};
        if(!status || !['active', 'inactive', 'suspended'].includes(status)) {
            return reply(res, 400, "Invalid status");
        }
        const tenant = await updateTenantStatus(req.params.id as string, status as TenantStatus);
        if(!tenant) { return reply(res, 404, "Tenant not found"); }
        return reply(res, 200, "Tenant status changed", { tenant });
    } catch (error) {
        return next(error);
    }
}

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenant = await deleteTenant(req.params.id as string);
        if(!tenant) { return reply(res, 404, "Tenant not found"); }
        return reply(res, 200, "Tenant deleted", { tenant });
    } catch (error) {
        return next(error);
    }
}

export const impersonateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tenant = await getTenant(req.params.id as string);
        if (!tenant) {
            return reply(res, 404, "Tenant not found");
        }

        const owner = await User.findById(tenant.owner);
        if (!owner) {
            return reply(res, 404, "Tenant owner not found");
        }

        const data = await issueTokenPair(owner._id, {
            deviceName: "Tenant impersonation",
            ipAddress: getClientIp(req),
        });

        return reply(res, 200, "Tenant impersonation started", data);
    } catch (error) {
        return next(error);
    }
}
