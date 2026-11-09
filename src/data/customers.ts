export interface CustomerAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  label_ar?: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  area: string;
  landmark?: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  name_ar?: string;
  phone: string;
  email: string;
  addresses: CustomerAddress[];
  totalOrders: number;
  totalSpent: number; // in EGP
  lastOrderDate: string;
  isBlacklisted: boolean;
  blacklistReason?: string;
  blacklistedAt?: string;
  source: 'delivery' | 'pos_reservation' | 'customer_ui' | 'manual';
  notes?: string;
}

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Mike Thompson',
    name_ar: 'مايك طومسون',
    phone: '+20 101 284 9801',
    email: 'mike.t@example.com',
    addresses: [
      {
        id: 'a1-1',
        label: 'Home',
        label_ar: 'المنزل',
        street: 'Street 9, Road 250',
        building: 'Building 14',
        floor: '4th Floor',
        apartment: 'Apt 4B',
        area: 'Maadi, Cairo',
        landmark: 'Near Degla Square',
        isDefault: true,
      },
      {
        id: 'a1-2',
        label: 'Work',
        label_ar: 'العمل',
        street: 'South 90th Street',
        building: 'Tech Hub Office 302',
        floor: '3rd Floor',
        area: 'New Cairo',
        landmark: 'Next to Dusit Thani',
        isDefault: false,
      },
    ],
    totalOrders: 14,
    totalSpent: 4250.0,
    lastOrderDate: 'Today, 11:30 AM',
    isBlacklisted: false,
    source: 'delivery',
    notes: 'Prefers contactless delivery and mild spice.',
  },
  {
    id: 'c2',
    name: 'Jenny Wilson',
    name_ar: 'جيني ويلسون',
    phone: '+20 102 384 1920',
    email: 'jenny.w@example.com',
    addresses: [
      {
        id: 'a2-1',
        label: 'Home',
        label_ar: 'المنزل',
        street: '26th of July Corridor',
        building: 'Nile Palace Tower',
        floor: '7th Floor',
        apartment: 'Apt 12',
        area: 'Zamalek, Cairo',
        landmark: 'Opposite Gezira Club',
        isDefault: true,
      },
    ],
    totalOrders: 9,
    totalSpent: 2780.0,
    lastOrderDate: 'Yesterday, 8:15 PM',
    isBlacklisted: false,
    source: 'pos_reservation',
    notes: 'Regular diner at Table 05.',
  },
  {
    id: 'c3',
    name: 'Tariq Al-Mansoor',
    name_ar: 'طارق المنصور',
    phone: '+20 108 984 7986',
    email: 'tariq.m@example.com',
    addresses: [
      {
        id: 'a3-1',
        label: 'Home',
        label_ar: 'المنزل',
        street: 'Abbas El Akkad St',
        building: 'Block 24',
        floor: '2nd Floor',
        apartment: 'Apt 6',
        area: 'Nasr City, Cairo',
        landmark: 'Behind Wonder Land',
        isDefault: true,
      },
    ],
    totalOrders: 3,
    totalSpent: 650.0,
    lastOrderDate: '15 Oct 2026',
    isBlacklisted: true,
    blacklistReason: 'Repeated order cancellations at doorstep and abusive behaviour with delivery driver.',
    blacklistedAt: '15 Oct 2026',
    source: 'delivery',
    notes: 'Do not accept delivery or table reservations.',
  },
  {
    id: 'c4',
    name: 'Kristin Watson',
    name_ar: 'كريستين واتسون',
    phone: '+20 103 484 2931',
    email: 'kristin.w@example.com',
    addresses: [
      {
        id: 'a4-1',
        label: 'Home',
        label_ar: 'المنزل',
        street: 'Mossadak Street',
        building: 'Building 18',
        floor: '1st Floor',
        apartment: 'Apt 2',
        area: 'Dokki, Giza',
        isDefault: true,
      },
      {
        id: 'a4-2',
        label: 'Other',
        label_ar: 'آخر',
        street: 'Bahr El Aazam',
        building: 'Villa 5',
        area: 'Giza Waterfront',
        isDefault: false,
      },
    ],
    totalOrders: 11,
    totalSpent: 3420.0,
    lastOrderDate: '3 days ago',
    isBlacklisted: false,
    source: 'customer_ui',
  },
  {
    id: 'c5',
    name: 'Esther Howard',
    name_ar: 'إستر هوارد',
    phone: '+20 105 684 4953',
    email: 'esther.h@example.com',
    addresses: [
      {
        id: 'a5-1',
        label: 'Home',
        label_ar: 'المنزل',
        street: 'El Teseen El Shamaly',
        building: 'Hyde Park Compound',
        apartment: 'Villa 104',
        area: 'New Cairo',
        landmark: 'Gate 2',
        isDefault: true,
      },
    ],
    totalOrders: 18,
    totalSpent: 6100.0,
    lastOrderDate: '4 days ago',
    isBlacklisted: false,
    source: 'delivery',
    notes: 'VIP customer. Prefers paper packaging.',
  },
  {
    id: 'c6',
    name: 'Guy Hawkins',
    name_ar: 'جاي هوكينز',
    phone: '+20 104 584 3942',
    email: 'guy.h@example.com',
    addresses: [
      {
        id: 'a6-1',
        label: 'Home',
        label_ar: 'المنزل',
        street: 'El Merghany St',
        building: 'Building 40',
        floor: '5th Floor',
        apartment: 'Apt 501',
        area: 'Heliopolis, Cairo',
        landmark: 'Near Baron Palace',
        isDefault: true,
      },
    ],
    totalOrders: 6,
    totalSpent: 1890.0,
    lastOrderDate: '1 week ago',
    isBlacklisted: false,
    source: 'pos_reservation',
  },
  {
    id: 'c7',
    name: 'Brooklyn Simmons',
    name_ar: 'بروكلين سيمونز',
    phone: '+20 106 784 5964',
    email: 'brooklyn.s@example.com',
    addresses: [
      {
        id: 'a7-1',
        label: 'Home',
        label_ar: 'المنزل',
        street: 'Mehwer 26th July',
        building: 'Palm Hills Compound',
        apartment: 'Townhouse 12',
        area: '6th of October City',
        isDefault: true,
      },
    ],
    totalOrders: 8,
    totalSpent: 2450.0,
    lastOrderDate: '1 week ago',
    isBlacklisted: false,
    source: 'customer_ui',
  },
  {
    id: 'c8',
    name: 'Cameron Will',
    name_ar: 'كاميرون ويل',
    phone: '+20 107 884 6975',
    email: 'cameron.w@example.com',
    addresses: [
      {
        id: 'a8-1',
        label: 'Home',
        label_ar: 'المنزل',
        street: 'Syria Street',
        building: 'Building 11',
        floor: '3rd Floor',
        apartment: 'Apt 3A',
        area: 'Mohandessin, Giza',
        isDefault: true,
      },
    ],
    totalOrders: 5,
    totalSpent: 1320.0,
    lastOrderDate: '2 weeks ago',
    isBlacklisted: false,
    source: 'delivery',
  },
];

const STORAGE_KEY = 'rod-saved-customers';

export function loadCustomers(): Customer[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOMERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load saved customers from localStorage:', err);
    return INITIAL_CUSTOMERS;
  }
}

export function saveCustomers(customers: Customer[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (err) {
    console.warn('Failed to save customers to localStorage:', err);
  }
}

/**
 * Autocomplete helper for delivery order creation:
 * Matches by phone number (sanitized) to return the customer and all saved addresses.
 */
export function findCustomerByPhone(phone: string): Customer | undefined {
  const cleanPhone = phone.replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 5) return undefined;
  const customers = loadCustomers();
  return customers.find((c) => {
    const targetClean = c.phone.replace(/\D/g, '');
    return targetClean.endsWith(cleanPhone) || cleanPhone.endsWith(targetClean);
  });
}

