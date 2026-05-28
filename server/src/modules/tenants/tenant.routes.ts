import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { create, list, getById, changedStatus, deleteById, impersonateById } from "./tenant.controller";

const router = express.Router();

/**
 * @openapi
 * /api/tenants:
 *   post:
 *     tags: [Tenants]
 *     summary: Create a new tenant
 *     operationId: createTenant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Display name (slug is generated automatically)
 *               domain:
 *                 type: string
 *                 description: Optional custom domain
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 default: active
 *               ownerEmail:
 *                 type: string
 *                 format: email
 *                 description: Tenant owner user email (required when superadmin creates)
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Required with ownerEmail when creating owner account
 *               confirmPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: Must match password
 *               ownerId:
 *                 type: string
 *                 description: Tenant owner user id (alternative to ownerEmail)
 *     responses:
 *       201:
 *         description: Tenant created
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, authorize('tenants:create'), create);

/**
 * @openapi
 * /api/tenants:
 *   get:
 *     tags: [Tenants]
 *     summary: List all tenants (superadmin only)
 *     operationId: listTenants
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tenants list
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize('tenants:read_any'), list);

/**
 * @openapi
 * /api/tenants/{id}:
 *   get:
 *     tags: [Tenants]
 *     summary: Get tenant by ID
 *     operationId: getTenantById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant found
 *       404:
 *         description: Tenant not found
 */
router.get('/:id', authenticate, authorize('tenants:read_any'), getById);

/**
 * @openapi
 * /api/tenants/{id}/status:
 *   put:
 *     tags: [Tenants]
 *     summary: Change tenant status (suspend/activate)
 *     operationId: changeTenantStatus
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Status changed
 *       404:
 *         description: Tenant not found
 */
router.put('/:id/status', authenticate, authorize('tenants:suspend'), changedStatus);

/**
 * @openapi
 * /api/tenants/{id}/impersonate:
 *   post:
 *     tags: [Tenants]
 *     summary: Impersonate tenant owner (superadmin only)
 *     operationId: impersonateTenant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Access + refresh tokens for tenant owner
 *       404:
 *         description: Tenant or tenant owner not found
 *       403:
 *         description: Forbidden
 */
router.post('/:id/impersonate', authenticate, authorize('tenants:impersonate'), impersonateById);

/**
 * @openapi
 * /api/tenants/{id}:
 *   delete:
 *     tags: [Tenants]
 *     summary: Delete a tenant
 *     operationId: deleteTenant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant deleted
 *       404:
 *         description: Tenant not found
 */
router.delete('/:id', authenticate, authorize('tenants:delete'), deleteById);

export default router;
