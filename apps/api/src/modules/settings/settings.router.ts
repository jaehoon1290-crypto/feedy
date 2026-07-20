import { Router } from 'express';
import { auth, type AuthRequest, asyncHandler } from '../../shared/http.js';
import { requireRole } from '../../shared/roles.js';
import { Store } from '../stores/store.model.js';
import { StoreSettings, UserSettings } from './settings.model.js';

const router = Router();
router.use(auth);
router.get('/user', asyncHandler(async (req: AuthRequest, res) => {
  const data = await UserSettings.findOneAndUpdate({ userId: req.userId }, { $setOnInsert: { userId: req.userId } }, { new: true, upsert: true });
  res.json({ data });
}));
router.patch('/user', asyncHandler(async (req: AuthRequest, res) => {
  const data = await UserSettings.findOneAndUpdate({ userId: req.userId }, { $set: req.body }, { new: true, upsert: true });
  res.json({ data });
}));
router.get('/stores/:storeId', requireRole('OWNER', 'ADMIN'), asyncHandler(async (req: AuthRequest, res) => {
  if (!await Store.exists({ _id: req.params.storeId, ownerId: req.userId })) return res.sendStatus(404);
  const data = await StoreSettings.findOneAndUpdate({ storeId: req.params.storeId }, { $setOnInsert: { storeId: req.params.storeId } }, { new: true, upsert: true });
  res.json({ data });
}));
router.patch('/stores/:storeId', requireRole('OWNER', 'ADMIN'), asyncHandler(async (req: AuthRequest, res) => {
  if (!await Store.exists({ _id: req.params.storeId, ownerId: req.userId })) return res.sendStatus(404);
  const data = await StoreSettings.findOneAndUpdate({ storeId: req.params.storeId }, { $set: req.body }, { new: true, upsert: true });
  res.json({ data });
}));
export default router;
