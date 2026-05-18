import express from 'express';
import { createEvent, getEvents, deleteEvent } from './events.controller';
import { authenticate } from '../../shared/middleware/authenticate';

const router = express.Router();
router.use(authenticate);

/**
 * @openapi
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: List all events
 *     operationId: getEvents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventsListResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Missing or invalid Bearer token
 *   post:
 *     tags: [Events]
 *     summary: Create an event
 *     operationId: createEvent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventInput'
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventCreatedResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Missing or invalid Bearer token
 */
router.get('/', getEvents);
router.post('/', createEvent);

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Delete an event by ID
 *     operationId: deleteEvent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deletion result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteMessage'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Missing or invalid Bearer token
 */
router.delete('/:id', deleteEvent);

export default router;