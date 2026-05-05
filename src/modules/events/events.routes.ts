import express from 'express';
import { createEvent, getEvents, deleteEvent } from './events.controller';

const router = express.Router();

/**
 * @openapi
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: List all events
 *     operationId: getEvents
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
 *   post:
 *     tags: [Events]
 *     summary: Create an event
 *     operationId: createEvent
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
 */
router.delete('/:id', deleteEvent);

export default router;
