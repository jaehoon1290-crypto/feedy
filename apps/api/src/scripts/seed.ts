import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Category, Store } from '../modules/stores/store.model.js';
import { User } from '../modules/users/user.model.js';

const categories = ['치킨','피자','한식','중식','일식','족발/보쌈','분식','카페/디저트'];
const menuNames = ['대표 메뉴','스페셜 메뉴','인기 메뉴','매콤한 메뉴','순한 메뉴','세트 메뉴','사이드 메뉴','음료','추가 메뉴','오늘의 메뉴'];
const stores = [
  ['교촌치킨 복대점','치킨'],['BBQ 복대점','치킨'],['BHC 복대점','치킨'],['맘스터치 복대점','치킨'],['홍콩반점 복대점','중식'],['역전우동 복대점','일식'],['청년다방 복대점','분식'],['메가커피 복대점','카페/디저트'],['컴포즈커피 복대점','카페/디저트'],['이디야 복대점','카페/디저트']
] as const;
const makeMenus = (storeName: string) => menuNames.map((name, index) => ({ name: index === 0 ? `${storeName} ${name}` : name, description: '복대동 배달 가능 메뉴입니다.', price: 4000 + index * 1200, imageUrl: `https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80`, options: index < 3 ? [{ name: '옵션', choices: [{ name: '기본', price: 0 }, { name: '곱빼기', price: 1000 }] }] : [], isSoldOut: false }));

await mongoose.connect(env.mongoUri);
const categoryMap = new Map<string, string>();
for (const name of categories) { const category = await Category.findOneAndUpdate({ name }, { $setOnInsert: { name } }, { new: true, upsert: true }); categoryMap.set(name, category.id); }
const passwordHash = await bcrypt.hash('FeedyTest123!', 12);
const customer = await User.findOneAndUpdate({ email: 'customer@feedy.test' }, { $set: { name: '테스트 고객', role: 'CUSTOMER', passwordHash } }, { new: true, upsert: true });
const owner = await User.findOneAndUpdate({ email: 'owner@feedy.test' }, { $set: { name: '테스트 사장님', role: 'OWNER', passwordHash } }, { new: true, upsert: true });
await User.findOneAndUpdate({ email: 'admin@feedy.test' }, { $set: { name: '테스트 관리자', role: 'ADMIN', passwordHash } }, { new: true, upsert: true });
for (const [name, categoryName] of stores) { const categoryId = categoryMap.get(categoryName)!; await Store.findOneAndUpdate({ name }, { $set: { ownerId: owner.id, name, categoryId, categoryIds: [categoryId], address: '충청북도 청주시 흥덕구 복대동', phone: '043-000-0000', description: `${name}의 복대동 배달 전문 매장입니다.`, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', deliveryFee: 0, minimumOrder: 12000, estimatedDeliveryMinutes: 30, isOpen: true, businessHours: [{ day: '매일', open: '10:00', close: '23:00', isClosed: false }], menus: makeMenus(name) } }, { new: true, upsert: true }); }
console.log(`Seed complete: ${categories.length} categories, ${stores.length} stores, ${stores.length * menuNames.length} menus, 3 accounts. Customer: customer@feedy.test / FeedyTest123!`);
await mongoose.disconnect();
