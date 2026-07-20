import { Router } from 'express';
import { auth, asyncHandler } from '../../shared/http.js';
import { requireRole } from '../../shared/roles.js';
import { User } from '../users/user.model.js';
import { Store, Category } from '../stores/store.model.js';
import { Order } from '../orders/order.model.js';

const router = Router(); router.use(auth, requireRole('ADMIN'));
router.get('/dashboard', asyncHandler(async (_req, res) => { const [users, stores, orders] = await Promise.all([User.countDocuments(), Store.countDocuments(), Order.countDocuments()]); res.json({ data: { users, stores, orders } }); }));
router.get('/users', asyncHandler(async (_req, res) => res.json({ data: await User.find().select('name email role createdAt').limit(100) })));
router.get('/orders', asyncHandler(async (_req, res) => res.json({ data: await Order.find().sort('-createdAt').limit(100) })));
router.get('/categories', asyncHandler(async (_req, res) => res.json({ data: await Category.find().sort('name') })));
router.post('/categories', asyncHandler(async (req, res) => { const name = String(req.body.name ?? '').trim(); if (!name) return res.status(400).json({ message: '카테고리 이름을 입력해 주세요.' }); res.status(201).json({ data: await Category.create({ name }) }); }));
router.delete('/categories/:id', asyncHandler(async (req, res) => { if (await Store.exists({ categoryId: req.params.id })) return res.status(409).json({ message: '사용 중인 카테고리는 삭제할 수 없습니다.' }); await Category.findByIdAndDelete(req.params.id); res.status(204).send(); }));
export default router;
