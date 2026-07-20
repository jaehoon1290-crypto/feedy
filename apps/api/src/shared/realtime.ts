import type { Server } from 'socket.io';
let io: Server | undefined;
export const bindRealtime = (server: Server) => { io = server; };
export const emitOrderChanged = (storeId: string, userId: string, order: unknown) => { io?.to(`store:${storeId}`).emit('order:changed', order); io?.to(`user:${userId}`).emit('order:changed', order); io?.to('admin').emit('order:changed', order); };
