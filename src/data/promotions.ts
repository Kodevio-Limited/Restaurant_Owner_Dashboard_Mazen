export type DiscountType = 'percent' | 'fixed' | 'free_item' | 'bogo';
export type AppliesToType = 'whole_order' | 'categories' | 'items';
export type OrderType = 'dine_in' | 'takeaway' | 'delivery' | 'qr';
export type PromoStatus = 'active' | 'paused' | 'scheduled' | 'expired';

export interface PromoRecentOrder {
  id: string;
  orderNo: string;
  date: string;
  customer: string;
  channel: string;
  subtotal: number;
  discount: number;
  total: number;
}

export interface PromoCode {
  id: string;
  code: string;
  name: string;
  name_ar?: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 20 for 20%, or 50 for 50 EGP
  maxDiscountCap?: number; // in EGP (for % off)
  freeItemName?: string;
  bogoBuyQty?: number;
  bogoGetQty?: number;
  appliesTo: AppliesToType;
  selectedCategories?: string[];
  selectedItems?: string[];
  excludedItems?: string[];
  orderTypes: OrderType[];
  minOrderAmount: number; // in EGP
  validDays: string[]; // e.g. ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  allDay: boolean;
  timeWindow?: { start: string; end: string }; // e.g. { start: '15:00', end: '18:00' }
  startDate: string;
  endDate: string;
  timezone: string; // 'Cairo Time (UTC+2)'
  totalUsageLimit: number | null; // null = unlimited
  currentUses: number;
  canCombineWithOtherOffers: boolean;
  branches: 'all' | string[];
  status: PromoStatus;
  // Report metrics
  totalDiscountGiven: number; // in EGP
  revenueGenerated: number; // in EGP
  recentOrders?: PromoRecentOrder[];
}

export const INITIAL_PROMOTIONS: PromoCode[] = [
  {
    id: 'pr-1',
    code: 'WELCOME10',
    name: 'New Customer Welcome',
    name_ar: 'ترحيب بالعميل الجديد',
    description: '10% off on first order, capped at EGP 35',
    discountType: 'percent',
    discountValue: 10,
    maxDiscountCap: 35,
    appliesTo: 'whole_order',
    orderTypes: ['dine_in', 'takeaway', 'delivery', 'qr'],
    minOrderAmount: 100,
    validDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    allDay: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    timezone: 'Cairo Time (UTC+2)',
    totalUsageLimit: 500,
    currentUses: 142,
    canCombineWithOtherOffers: false,
    branches: 'all',
    status: 'active',
    totalDiscountGiven: 3450.0,
    revenueGenerated: 34500.0,
    recentOrders: [
      { id: 'ro-1', orderNo: '#0044', date: 'Today, 11:30 AM', customer: 'Mike Thompson', channel: 'Dine-In', subtotal: 180, discount: 18, total: 162 },
      { id: 'ro-2', orderNo: '#0042', date: 'Today, 10:15 AM', customer: 'Jenny Wilson', channel: 'Delivery', subtotal: 250, discount: 25, total: 225 },
      { id: 'ro-3', orderNo: '#0039', date: 'Yesterday, 8:40 PM', customer: 'Kristin Watson', channel: 'QR App', subtotal: 350, discount: 35, total: 315 },
    ],
  },
  {
    id: 'pr-2',
    code: 'MAZEN50',
    name: 'Weekend Feast 50 EGP Off',
    name_ar: 'خصم 50 جنيه لوليمة نهاية الأسبوع',
    description: 'Flat EGP 50 off on orders over EGP 250',
    discountType: 'fixed',
    discountValue: 50,
    appliesTo: 'whole_order',
    orderTypes: ['dine_in', 'delivery', 'qr'],
    minOrderAmount: 250,
    validDays: ['thu', 'fri', 'sat'],
    allDay: true,
    startDate: '2026-06-01',
    endDate: '2026-12-31',
    timezone: 'Cairo Time (UTC+2)',
    totalUsageLimit: 200,
    currentUses: 88,
    canCombineWithOtherOffers: false,
    branches: 'all',
    status: 'active',
    totalDiscountGiven: 4400.0,
    revenueGenerated: 28600.0,
    recentOrders: [
      { id: 'ro-4', orderNo: '#0035', date: 'Yesterday, 9:20 PM', customer: 'Esther Howard', channel: 'Delivery', subtotal: 340, discount: 50, total: 290 },
      { id: 'ro-5', orderNo: '#0033', date: '06-11-2026', customer: 'Brooklyn Simmons', channel: 'QR App', subtotal: 310, discount: 50, total: 260 },
    ],
  },
  {
    id: 'pr-3',
    code: 'LUNCH20',
    name: 'Weekday Lunch Rush 20%',
    name_ar: 'ساعة الغداء الأسبوعية 20%',
    description: '20% off on all Burgers & Ramen between 12 PM - 5 PM',
    discountType: 'percent',
    discountValue: 20,
    maxDiscountCap: 60,
    appliesTo: 'categories',
    selectedCategories: ['Burgers', 'Ramen'],
    orderTypes: ['dine_in', 'takeaway', 'qr'],
    minOrderAmount: 120,
    validDays: ['sun', 'mon', 'tue', 'wed', 'thu'],
    allDay: false,
    timeWindow: { start: '12:00', end: '17:00' },
    startDate: '2026-03-01',
    endDate: '2026-11-30',
    timezone: 'Cairo Time (UTC+2)',
    totalUsageLimit: 300,
    currentUses: 65,
    canCombineWithOtherOffers: false,
    branches: 'all',
    status: 'active',
    totalDiscountGiven: 1950.0,
    revenueGenerated: 11200.0,
    recentOrders: [
      { id: 'ro-6', orderNo: '#0028', date: '06-10-2026, 1:15 PM', customer: 'Cameron Will', channel: 'Dine-In', subtotal: 210, discount: 42, total: 168 },
    ],
  },
  {
    id: 'pr-4',
    code: 'FREETRUFFLE',
    name: 'Free Truffle Fries',
    name_ar: 'بطاطس كمأة مجاناً',
    description: 'Get a free Truffle Fries when you spend EGP 200 or more',
    discountType: 'free_item',
    discountValue: 35, // retail value of free item
    freeItemName: 'Truffle Fries',
    appliesTo: 'whole_order',
    orderTypes: ['dine_in', 'delivery', 'qr'],
    minOrderAmount: 200,
    validDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    allDay: true,
    startDate: '2026-05-01',
    endDate: '2026-12-15',
    timezone: 'Cairo Time (UTC+2)',
    totalUsageLimit: 150,
    currentUses: 43,
    canCombineWithOtherOffers: false,
    branches: 'all',
    status: 'active',
    totalDiscountGiven: 1505.0,
    revenueGenerated: 12900.0,
    recentOrders: [
      { id: 'ro-7', orderNo: '#0022', date: '06-09-2026, 7:45 PM', customer: 'Guy Hawkins', channel: 'Delivery', subtotal: 260, discount: 35, total: 225 },
    ],
  },
  {
    id: 'pr-5',
    code: 'BOGORAMEN',
    name: 'Buy 1 Get 1 Ramen',
    name_ar: 'اشترِ رامين واحصل على الثاني مجاناً',
    description: 'Buy 1 Ramen get 1 free on dine-in tables',
    discountType: 'bogo',
    discountValue: 85,
    bogoBuyQty: 1,
    bogoGetQty: 1,
    appliesTo: 'categories',
    selectedCategories: ['Ramen'],
    orderTypes: ['dine_in', 'qr'],
    minOrderAmount: 85,
    validDays: ['mon', 'tue', 'wed'],
    allDay: true,
    startDate: '2026-04-01',
    endDate: '2026-10-31',
    timezone: 'Cairo Time (UTC+2)',
    totalUsageLimit: 100,
    currentUses: 19,
    canCombineWithOtherOffers: false,
    branches: 'all',
    status: 'paused',
    totalDiscountGiven: 1615.0,
    revenueGenerated: 4200.0,
  },
  {
    id: 'pr-6',
    code: 'RAMADAN25',
    name: 'Ramadan Family Special 25%',
    name_ar: 'عرض رمضان العائلي 25%',
    description: '25% discount for Iftar and Suhoor orders',
    discountType: 'percent',
    discountValue: 25,
    maxDiscountCap: 150,
    appliesTo: 'whole_order',
    orderTypes: ['dine_in', 'takeaway', 'delivery', 'qr'],
    minOrderAmount: 350,
    validDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    allDay: false,
    timeWindow: { start: '17:00', end: '03:00' },
    startDate: '2027-02-15',
    endDate: '2027-03-25',
    timezone: 'Cairo Time (UTC+2)',
    totalUsageLimit: 1000,
    currentUses: 0,
    canCombineWithOtherOffers: true,
    branches: 'all',
    status: 'scheduled',
    totalDiscountGiven: 0,
    revenueGenerated: 0,
  },
];

const STORAGE_KEY = 'rod-promotions';

export function loadPromotions(): PromoCode[] {
  if (typeof window === 'undefined') return INITIAL_PROMOTIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROMOTIONS));
      return INITIAL_PROMOTIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load promotions from localStorage:', err);
    return INITIAL_PROMOTIONS;
  }
}

export function savePromotions(promotions: PromoCode[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions));
  } catch (err) {
    console.warn('Failed to save promotions to localStorage:', err);
  }
}

/**
 * Generate a random uppercase alphanumeric promo code.
 */
export function generateRandomCode(prefix = 'MAZEN'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix.trim().toUpperCase()}${rand}` : rand;
}

/**
 * Generate X unique bulk single-use promo codes (no CSV formatting,
 * so callers can attach their own promo details to each code).
 */
export function bulkGenerateCodes(prefix: string, count: number): string[] {
  const cleanPrefix = (prefix || 'PROMO').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const codes: string[] = [];
  const set = new Set<string>();

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  while (codes.length < count) {
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const code = `${cleanPrefix}-${rand}`;
    if (!set.has(code)) {
      set.add(code);
      codes.push(code);
    }
  }

  return codes;
}

