import { Router } from 'express';
import { auth, type AuthRequest, asyncHandler } from '../../shared/http.js';
import { Favorite } from './favorite.model.js';
import { Store } from '../stores/store.model.js';

const router = Router();
router.use(auth);
router.get('/', asyncHandler(async (req: AuthRequest, res) => { const favorites = await Favorite.find({ userId: req.userId }); const stores = await Store.find({ _id: { $in: favorites.map(f => f.storeId) } }); res.json({ data: stores }); }));
router.put('/:storeId', asyncHandler(async (req: AuthRequest, res) => { const result = await Favorite.updateOne({ userId: req.userId, storeId: req.params.storeId }, { $setOnInsert: { userId: req.userId, storeId: req.params.storeId } }, { upsert: true }); if (result.upsertedCount) await Store.updateOne({ _id: req.params.storeId }, { $inc: { favoriteCount: 1 } }); res.status(204).send(); }));
router.delete('/:storeId', asyncHandler(async (req: AuthRequest, res) => { const result = await Favorite.deleteOne({ userId: req.userId, storeId: req.params.storeId }); if (result.deletedCount) await Store.updateOne({ _id: req.params.storeId, favoriteCount: { $gt: 0 } }, { $inc: { favoriteCount: -1 } }); res.status(204).send(); }));
export default router;
