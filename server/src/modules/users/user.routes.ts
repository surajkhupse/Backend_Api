import express, { NextFunction } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { list, me, updateMe } from "./user.controller";

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (superadmin only)
 *     operationId: listUsers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticate, authorize("users:read_any"), list);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get my profile
 *     operationId: getMyProfile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My profile
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, me);

/**
 * @openapi
 * /api/users/me:
 *   put:
 *     tags: [Users]
 *     summary: Update my profile
 *     operationId: updateMyProfile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My profile updated
 *       401:
 *         description: Unauthorized
 */
router.put("/me", authenticate, updateMe);

export default router;
