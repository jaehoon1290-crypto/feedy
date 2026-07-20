export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERY_REQUESTED' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CARD_ON_DELIVERY' | 'CASH_ON_DELIVERY';
export type UserRole = 'CUSTOMER' | 'OWNER' | 'ADMIN';
export interface Address { id?: string; label: string; address: string; detail?: string; latitude?: number; longitude?: number; isDefault?: boolean }
export interface Category { id: string; name: string; imageUrl?: string }
export interface Menu { id: string; name: string; description?: string; price: number; imageUrl?: string; isSoldOut?: boolean }
export interface Store { id: string; name: string; categoryId: string; address: string; deliveryFee: number; minimumOrder: number; favoriteCount: number; estimatedDeliveryMinutes: number; menus?: Menu[]; /** Review projection is intentionally excluded from the MVP store contract. */ rating?: never; reviewCount?: never }
export interface CartItem { menuId: string; name: string; price: number; quantity: number }
export interface OrderRequests { storeNote?: string; deliveryNote?: string; needsUtensils: boolean }
export interface Order { id: string; store: Pick<Store, 'id' | 'name'>; items: CartItem[]; totalAmount: number; deliveryFee: number; status: OrderStatus; paymentMethod: PaymentMethod; requests: OrderRequests; deliveryAddress: Address; createdAt: string }
export interface ApiResponse<T> { data: T; message?: string }
export interface PaymentProvider { requestPayment(input: { orderId: string; amount: number; method: string }): Promise<{ paymentId: string; redirectUrl?: string }>; cancelPayment(paymentId: string): Promise<void> }
export interface MapProvider { reverseGeocode(coordinate: { latitude: number; longitude: number }): Promise<{ address: string; detail?: string }> }
export interface NotificationProvider { send(input: { recipientId: string; title: string; body: string; data?: Record<string, string> }): Promise<void> }
