import { Router } from 'express';
import { z } from 'zod';
import { auth, type AuthRequest, asyncHandler } from '../../shared/http.js';
import { emitOrderChanged } from '../../shared/realtime.js';
import { requireRole } from '../../shared/roles.js';
import { Store } from '../stores/store.model.js';
import { Order } from '../orders/order.model.js';

const router = Router(); router.use(auth, requireRole('OWNER', 'ADMIN'));
const storeInput = z.object({ name: z.string().min(1), categoryId: z.string(), address: z.string().min(1), minimumOrder: z.number().nonnegative(), deliveryFee: z.number().nonnegative(), estimatedDeliveryMinutes: z.number().positive() });
router.get('/stores', asyncHandler(async (req: AuthRequest, res) => res.json({ data: await Store.find({ ownerId: req.userId }) })));
router.post('/stores', asyncHandler(async (req: AuthRequest, res) => { const store = await Store.create({ ...storeInput.parse(req.body), ownerId: req.userId }); res.status(201).json({ data: store }); }));
router.patch('/stores/:storeId', asyncHandler(async (req: AuthRequest, res) => { const store = await Store.findOneAndUpdate({ _id: req.params.storeId, ownerId: req.userId }, { $set: req.body }, { new: true }); if (!store) return res.sendStatus(404); res.json({ data: store }); }));
router.get('/stores/:storeId/orders', asyncHandler(async (req: AuthRequest, res) => { const store = await Store.exists({ _id: req.params.storeId, ownerId: req.userId }); if (!store) return res.sendStatus(404); const orders = await Order.find({ storeId: req.params.storeId }).sort('-createdAt').limit(100); res.json({ data: orders }); }));
router.post('/stores/:storeId/menus', asyncHandler(async (req: AuthRequest, res) => { const menu = z.object({ name: z.string(), description: z.string().optional(), price: z.number().positive() }).parse(req.body); const store = await Store.findOneAndUpdate({ _id: req.params.storeId, ownerId: req.userId }, { $push: { menus: menu } }, { new: true }); if (!store) return res.sendStatus(404); res.status(201).json({ data: store.menus.at(-1) }); }));
router.patch('/stores/:storeId/menus/:menuId', asyncHandler(async (req: AuthRequest, res) => { const update = z.object({ name: z.string().optional(), description: z.string().optional(), price: z.number().positive().optional(), isSoldOut: z.boolean().optional() }).parse(req.body); const menuId = String(req.params.menuId); const store = await Store.findOneAndUpdate({ _id: req.params.storeId, ownerId: req.userId, 'menus._id': menuId }, { $set: Object.fromEntries(Object.entries(update).map(([key, value]) => [`menus.$.${key}`, value])) }, { new: true }); const menu = store?.menus.id(menuId); if (!menu) return res.sendStatus(404); res.json({ data: menu }); }));
router.delete('/stores/:storeId/menus/:menuId', asyncHandler(async (req: AuthRequest, res) => { const store = await Store.findOneAndUpdate({ _id: req.params.storeId, ownerId: req.userId }, { $pull: { menus: { _id: req.params.menuId } } }, { new: true }); if (!store) return res.sendStatus(404); res.status(204).send(); }));
router.patch('/stores/:storeId/orders/:orderId/status', asyncHandler(async (req: AuthRequest, res) => { const { status } = z.object({ status: z.enum(['CONFIRMED', 'PREPARING', 'DELIVERY_REQUESTED', 'DELIVERING', 'COMPLETED', 'CANCELLED']) }).parse(req.body); const store = await Store.exists({ _id: req.params.storeId, ownerId: req.userId }); if (!store) return res.sendStatus(404); const order = await Order.findOneAndUpdate({ _id: req.params.orderId, storeId: req.params.storeId }, { status }, { new: true }); if (!order) return res.sendStatus(404); emitOrderChanged(String(req.params.storeId), String(order.userId), order); res.json({ data: order }); }));
export default router;
