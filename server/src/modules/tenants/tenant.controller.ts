import { Request, Response } from "express";
import { reply } from "../../utils/response";
import { createTenant, listTenants, getTenant, updateTenantStatus, deleteTenant } from "./tenant.service";
import { TenantStatus } from "./tenant.model";

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
}

export const create = async (req: Request, res: Response): Promise<Response | void> => {
   try {
    const { name } = req.body as { name? : string};
    if (!name) {
        return reply(res, 400, "Name is required");
    }
    const tenant = await createTenant(name, req.authUserId!);
    return reply(res, 201, "Tenant created", { tenant });
   } catch (error) {
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
