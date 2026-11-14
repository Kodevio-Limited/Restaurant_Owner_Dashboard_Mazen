import type { MenuItem } from '@/components/shared/MenuItemCard';

/**
 * Shared menu catalog used across the Owner Dashboard
 * (Menu Management page, Promotions free-item picker, etc.)
 */
export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    name_ar: 'برجر كلاسيك',
    category: 'BURGERS',
    category_ar: 'برجر',
    price: 'EGP 15.99',
    description: 'Crispy shoestring fries tossed in truffle oil and parmesan.',
    description_ar: 'بطاطس مقرمشة ممزوجة بزيت الكمأة وجبن بارميزان.',
    available: true,
  },
  {
    id: '2',
    name: 'Shoyu Ramen',
    name_ar: 'شويو رامين',
    category: 'RAMEN',
    category_ar: 'رامين',
    price: 'EGP 15.99',
    description: 'Rich tonkotsu broth with chashu, soft egg, and nori.',
    description_ar: 'مرق تونكوتسو غني مع لحم تشاشو، بيض طري، ونوري.',
    available: true,
  },
  {
    id: '3',
    name: 'Iced Green Tea',
    name_ar: 'شاي أخضر مثلج',
    category: 'DRINKS',
    category_ar: 'مشروبات',
    price: 'EGP 4.80',
    description: 'Freshly brewed Japanese green tea served over ice.',
    description_ar: 'شاي أخضر ياباني طازج يُقدم مع الثلج.',
    available: false,
  },
  {
    id: '4',
    name: 'Truffle Fries',
    name_ar: 'بطاطس الكمأة',
    category: 'SIDES',
    category_ar: 'أطباق جانبية',
    price: 'EGP 6.99',
    description: 'Crispy shoestring fries tossed in truffle oil and parmesan.',
    description_ar: 'بطاطس مقرمشة ممزوجة بزيت الكمأة وجبن بارميزان.',
    available: true,
  },
  {
    id: '5',
    name: 'Chicken Biryani',
    name_ar: 'برياني دجاج',
    category: 'RICE',
    category_ar: 'أرز',
    price: 'EGP 12.50',
    description: 'Fragrant basmati layered with spiced chicken and caramelized onions.',
    description_ar: 'أرز بسمتي عطري مع طبقات دجاج متبل وبصل مكرمل.',
    available: true,
  },
  {
    id: '6',
    name: 'Mango Lassi',
    name_ar: 'مانجو لاسي',
    category: 'DRINKS',
    category_ar: 'مشروبات',
    price: 'EGP 4.30',
    description: 'Creamy yogurt drink blended with ripe mango and cardamom.',
    description_ar: 'مشروب زبادي كريمي ممزوج بالمانجو الناضج والهيل.',
    available: true,
  },
];
